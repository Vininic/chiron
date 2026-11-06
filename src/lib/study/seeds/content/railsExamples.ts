export type RailsExample = { lang: "ruby"; code: string; purpose: string };

/** Dois exemplos por seção redigida; drafts até execução numa aplicação Rails real. */
export const RAILS_EXAMPLES: Record<string, [RailsExample, RailsExample]> = {
  "Versões e criação da aplicação": [
    { lang: "ruby", purpose: "Gate de boot registra a matriz efetiva e falha quando Rails sai da faixa aprovada.", code: `require "rails"
require "bundler"

approved = Gem::Requirement.new(">= 8.0", "< 9.0")
actual = Gem::Version.new(Rails.version)
abort("unsupported Rails #{actual}") unless approved.satisfied_by?(actual)

puts({ ruby_engine: RUBY_ENGINE, ruby: RUBY_VERSION, rails: Rails.version,
       bundler: Bundler::VERSION, platform: RUBY_PLATFORM }.inspect)` },
    { lang: "ruby", purpose: "Verificação recusa dependência Git móvel e exige lock compatível com a plataforma corrente.", code: `lock = Bundler::LockfileParser.new(Bundler.read_file(Bundler.default_lockfile))
moving_git = lock.sources.grep(Bundler::Source::Git).select { |source| source.revision.to_s.empty? }
platforms = lock.platforms.map(&:to_s)

raise "git dependency without revision" unless moving_git.empty?
raise "current platform absent from lock" if platforms.none? { |name| name == "ruby" || RUBY_PLATFORM.include?(name.split("-").first) }
puts "LOCK_POLICY_OK"` },
  ],
  "Boot, initializers e ambientes": [
    { lang: "ruby", purpose: "Configuração estrita distingue ausência, vazio e inteiro inválido antes de criar adapters.", code: `module AppConfig
  module_function
  def positive_integer!(env, key)
    raw = env.fetch(key) { raise KeyError, "missing #{key}" }
    raise ArgumentError, "empty #{key}" if raw.empty?
    value = Integer(raw, 10, exception: false)
    raise ArgumentError, "invalid #{key}" unless value&.positive?
    value
  end
end

raise unless AppConfig.positive_integer!({ "DB_POOL" => "12" }, "DB_POOL") == 12
begin AppConfig.positive_integer!({ "DB_POOL" => "many" }, "DB_POOL"); raise
rescue ArgumentError then puts "STRICT_CONFIG_OK" end` },
    { lang: "ruby", purpose: "Registro idempotente substitui subscriber por chave em vez de duplicá-lo a cada prepare.", code: `class Registry
  def initialize = @entries = {}
  def replace(key, callable) = @entries[key] = callable
  def size = @entries.size
  def call(key, event) = @entries.fetch(key).call(event)
end

registry = Registry.new
2.times { registry.replace(:reservation_metrics, ->(event) { event.fetch(:outcome) }) }
raise unless registry.size == 1
raise unless registry.call(:reservation_metrics, { outcome: :created }) == :created
puts "IDEMPOTENT_PREPARE_MODEL_OK"` },
  ],
  "Autoloading e reload com Zeitwerk": [
    { lang: "ruby", purpose: "Checker planejado torna explícito que eager load e naming são gates de aplicação, não require casual.", code: `module LoaderGate
  module_function
  def verify!(application)
    application.eager_load!
    loaders = Rails.autoloaders.each.to_a
    raise "no Rails autoloaders" if loaders.empty?
    { loaders: loaders.length, eager_loaded: true, rails: Rails.version }
  end
end

result = LoaderGate.verify!(Rails.application)
raise unless result[:eager_loaded]
puts result.inspect` },
    { lang: "ruby", purpose: "Callback de preparação usa chave estável e mantém um único handler após múltiplas execuções.", code: `HANDLERS = {} unless defined?(HANDLERS)

install = lambda do |implementation|
  HANDLERS[:reservation_policy] = implementation
end

install.call(->(tenant, record) { record.fetch(:tenant) == tenant })
install.call(->(tenant, record) { tenant == record.fetch(:tenant) && !record[:suspended] })

raise unless HANDLERS.size == 1
raise unless HANDLERS[:reservation_policy].call("alpha", { tenant: "alpha", suspended: false })
raise if HANDLERS[:reservation_policy].call("alpha", { tenant: "alpha", suspended: true })
puts "RELOAD_REGISTRATION_OK"` },
  ],
  "Ciclo Rack e ownership da requisição": [
    { lang: "ruby", purpose: "Middleware copia apenas identidade e dados limitados para um comando congelado, sem reter env ou body.", code: `Command = Data.define(:tenant, :request_id, :quantity)

class CommandBoundary
  def self.build(env, parsed)
    tenant = env.fetch("chiron.auth").fetch(:tenant).dup.freeze
    request_id = env.fetch("action_dispatch.request_id").to_s.dup.freeze
    quantity = Integer(parsed.fetch("quantity"), 10)
    raise ArgumentError unless quantity.between?(1, 8)
    Command.new(tenant:, request_id:, quantity:).freeze
  end
end

env = { "chiron.auth" => { tenant: "alpha" }, "action_dispatch.request_id" => "req-41" }
command = CommandBoundary.build(env, { "tenant" => "beta", "quantity" => "2" })
env["chiron.auth"][:tenant].replace("changed")
raise unless command.tenant == "alpha" && command.quantity == 2
puts "REQUEST_OWNERSHIP_OK"` },
    { lang: "ruby", purpose: "Mapper fechado preserva Created, replay, conflito e efeito ambíguo como contratos HTTP distintos.", code: `def http_response(outcome)
  case outcome.fetch(:type)
  when :created then [201, { "Location" => "/reservations/#{outcome.fetch(:id)}" }, outcome]
  when :replayed then [200, { "Idempotent-Replay" => "true" }, outcome]
  when :conflict then [409, {}, { code: "idempotency_conflict" }]
  when :sold_out then [409, {}, { code: "sold_out" }]
  when :unknown then [202, { "Location" => "/operations/#{outcome.fetch(:event_id)}" }, { code: "pending" }]
  else raise ArgumentError, "unmapped outcome"
  end
end

raise unless http_response(type: :created, id: "r-1").first == 201
raise unless http_response(type: :unknown, event_id: "e-1").first == 202
begin http_response(type: :future); raise
rescue ArgumentError then puts "CLOSED_HTTP_MAPPING_OK" end` },
  ],
  "Rotas REST, constraints e URLs": [
    { lang: "ruby", purpose: "Rotas expõem somente operações previstas e escopam a reserva pelo show antes da policy.", code: `Rails.application.routes.draw do
  resources :shows, only: %i[index show] do
    resources :reservations, only: %i[create show], shallow: true
  end
  namespace :operations do
    resources :reconciliations, only: %i[show]
  end
end

class ReservationsController < ApplicationController
  def show
    reservation = Current.tenant.reservations.find(params[:id])
    authorize reservation
    render json: ReservationPresenter.new(reservation).as_json
  end
end` },
    { lang: "ruby", purpose: "Redirect aceita somente paths locais analisados e a URL externa usa host configurado, não Host arbitrário.", code: `module SafeDestination
  module_function
  def local_path(raw)
    uri = URI.parse(raw.to_s)
    return "/" unless uri.host.nil? && uri.scheme.nil? && uri.path.start_with?("/") && !uri.path.start_with?("//")
    uri.path
  rescue URI::InvalidURIError
    "/"
  end
end

raise unless SafeDestination.local_path("/reservations/7") == "/reservations/7"
raise unless SafeDestination.local_path("https://attacker.example/x") == "/"
raise unless SafeDestination.local_path("//attacker.example/x") == "/"
puts "SAFE_REDIRECT_POLICY_OK"` },
  ],
  "Params, strong parameters e comandos": [
    { lang: "ruby", purpose: "Boundary permite shape fechado e deriva tenant exclusivamente da identidade autenticada.", code: `ReserveCommand = Data.define(:tenant_id, :show_id, :quantity, :idempotency_key)

def reserve_command(params, identity, headers)
  allowed = params.require(:reservation).permit(:show_id, :quantity)
  quantity = Integer(allowed.fetch(:quantity), 10)
  raise ActionController::BadRequest unless quantity.between?(1, 8)
  ReserveCommand.new(tenant_id: identity.fetch(:tenant_id), show_id: allowed.fetch(:show_id),
    quantity:, idempotency_key: headers.fetch("Idempotency-Key")).freeze
end

# O campo tenant_id enviado no body nunca participa da construção do comando.
puts "STRONG_PARAMS_COMMAND_DEFINED"` },
    { lang: "ruby", purpose: "Parser estrito recusa lixo numérico, booleanos ambíguos e chaves de idempotência grandes.", code: `module StrictInput
  module_function
  def quantity(raw)
    value = Integer(raw, 10, exception: false)
    value if raw.is_a?(String) && raw.match?(/\A[0-9]+\z/) && value&.between?(1, 8)
  end
  def boolean(raw) = { true => true, false => false, "true" => true, "false" => false }.fetch(raw, nil)
  def key(raw) = raw if raw.is_a?(String) && raw.bytesize.between?(8, 128) && raw.match?(/\A[A-Za-z0-9._:-]+\z/)
end

raise unless StrictInput.quantity("3") == 3
raise unless StrictInput.quantity("3x").nil? && StrictInput.boolean("yes").nil?
raise unless StrictInput.key("reserve:alpha:41")
puts "STRICT_INPUT_OK"` },
  ],
  "Responses, rendering e erros": [
    { lang: "ruby", purpose: "Presenter allowlisted impede que novas colunas Active Record apareçam automaticamente na API.", code: `class ReservationPresenter
  def initialize(reservation) = @reservation = reservation
  def as_json
    {
      id: @reservation.id.to_s,
      show_id: @reservation.show_id.to_s,
      quantity: @reservation.quantity,
      status: @reservation.status,
      created_at: @reservation.created_at.iso8601(3)
    }
  end
end

allowed = %i[id show_id quantity status created_at]
raise unless ReservationPresenter.instance_methods(false).include?(:as_json)
raise unless allowed.none? { _1.to_s.match?(/password|token|tenant/) }
puts "ALLOWLISTED_REPRESENTATION_OK"` },
    { lang: "ruby", purpose: "Mapper fechado preserva operação Unknown e faz variante futura falhar explicitamente.", code: `module ReservationHttp
  module_function
  def map(result)
    case result
    in { type: :created, id: } then [201, { location: "/reservations/#{id}" }]
    in { type: :replayed, id: } then [200, { id:, replayed: true }]
    in { type: :conflict } then [409, { code: "idempotency_conflict" }]
    in { type: :sold_out } then [409, { code: "sold_out" }]
    in { type: :unknown, event_id: } then [202, { code: "pending", event_id: }]
    else raise ArgumentError, "unmapped outcome"
    end
  end
end

raise unless ReservationHttp.map(type: :unknown, event_id: "e-7").first == 202
begin ReservationHttp.map(type: :future); raise
rescue ArgumentError then puts "CLOSED_RESPONSE_MAP_OK" end` },
  ],
  "Cookies, sessões e CSRF": [
    { lang: "ruby", purpose: "Login regenera a sessão e armazena apenas identidade mínima emitida pelo servidor.", code: `class SessionsController < ApplicationController
  def create
    user = User.authenticate_by(email: params[:email], password: params[:password])
    return head :unauthorized unless user&.active?

    reset_session
    session[:user_id] = user.id
    session[:authenticated_at] = Time.current.to_i
    redirect_to dashboard_path, status: :see_other
  end

  def destroy
    reset_session
    redirect_to root_path, status: :see_other
  end
end` },
    { lang: "ruby", purpose: "Mensagem assinada usa finalidade e expiração distintas para impedir token entre endpoints.", code: `class AccountToken
  def initialize(verifier) = @verifier = verifier
  def issue(user_id, purpose:, expires_in:)
    @verifier.generate({ user_id: }, purpose:, expires_in:)
  end
  def verify(token, purpose:)
    @verifier.verified(token, purpose:)&.fetch(:user_id, nil)
  end
end

verifier = ActiveSupport::MessageVerifier.new("x" * 64, serializer: JSON)
tokens = AccountToken.new(verifier)
token = tokens.issue(41, purpose: :confirm_email, expires_in: 600)
raise unless tokens.verify(token, purpose: :confirm_email) == 41
raise unless tokens.verify(token, purpose: :reset_password).nil?
puts "PURPOSE_BOUND_TOKEN_OK"` },
  ],
  "Migrations e schema": [
    { lang: "ruby", purpose: "Migration expand adiciona coluna compatível e valida constraint em etapa separada.", code: `class AddReservationEventId < ActiveRecord::Migration[8.0]
  def up
    add_column :reservations, :event_id, :string
    add_index :reservations, %i[tenant_id event_id], unique: true,
      where: "event_id IS NOT NULL", algorithm: :concurrently
    add_check_constraint :reservations, "event_id IS NULL OR length(event_id) BETWEEN 8 AND 128",
      name: "reservations_event_id_length", validate: false
  end

  def down
    remove_check_constraint :reservations, name: "reservations_event_id_length"
    remove_index :reservations, column: %i[tenant_id event_id]
    remove_column :reservations, :event_id
  end
end` },
    { lang: "ruby", purpose: "Preflight encontra violações antes de tornar o tenant obrigatório e registra somente contagens.", code: `class ValidateReservationTenant < ActiveRecord::Migration[8.0]
  disable_ddl_transaction!

  def up
    missing = select_value("SELECT count(*) FROM reservations WHERE tenant_id IS NULL").to_i
    raise ActiveRecord::IrreversibleMigration, "#{missing} rows without tenant" if missing.positive?
    validate_foreign_key :reservations, :tenants
    change_column_null :reservations, :tenant_id, false
  end

  def down
    change_column_null :reservations, :tenant_id, true
  end
end` },
  ],
  "Validações, callbacks e invariantes": [
    { lang: "ruby", purpose: "Validação fornece feedback, enquanto índice e check preservam a invariante concorrente.", code: `class Reservation < ApplicationRecord
  enum :status, { pending: "pending", confirmed: "confirmed", cancelled: "cancelled" }, validate: true
  validates :idempotency_key, presence: true, length: { in: 8..128 },
    uniqueness: { scope: :tenant_id }
  validates :quantity, numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 8 }

  def confirm!(actor_id:)
    with_lock do
      return :replayed if confirmed?
      raise InvalidTransition unless pending?
      update!(status: :confirmed, confirmed_by_id: actor_id, confirmed_at: Time.current)
      :confirmed
    end
  end
end` },
    { lang: "ruby", purpose: "Repository traduz somente a constraint de idempotência e faz readback do vencedor.", code: `class ReservationRepository
  IDEMPOTENCY_INDEX = "index_reservations_on_tenant_and_idempotency_key"

  def insert!(attributes)
    Reservation.create!(attributes)
  rescue ActiveRecord::RecordNotUnique => error
    raise unless error.message.include?(IDEMPOTENCY_INDEX)
    existing = Reservation.find_by!(tenant_id: attributes.fetch(:tenant_id),
      idempotency_key: attributes.fetch(:idempotency_key))
    return existing if existing.fingerprint == attributes.fetch(:fingerprint)
    raise IdempotencyConflict
  end
end` },
  ],
  "Associações e lifecycle": [
    { lang: "ruby", purpose: "Associações declaram ownership e o schema sustenta tenant e cardinalidade.", code: `class Tenant < ApplicationRecord
  has_many :shows, dependent: :restrict_with_error, inverse_of: :tenant
  has_many :reservations, dependent: :restrict_with_error, inverse_of: :tenant
end

class Show < ApplicationRecord
  belongs_to :tenant, inverse_of: :shows
  has_many :reservations, dependent: :restrict_with_error, inverse_of: :show
end

class Reservation < ApplicationRecord
  belongs_to :tenant, inverse_of: :reservations
  belongs_to :show, inverse_of: :reservations
  validates :show_id, uniqueness: { scope: %i[tenant_id idempotency_key] }
end` },
    { lang: "ruby", purpose: "Remoção grande vira lifecycle auditável em vez de cascade escondida na request.", code: `class RetireTenant
  def call(tenant:, actor:)
    tenant.with_lock do
      return { type: :replayed, operation_id: tenant.retirement_operation_id } if tenant.retiring?
      operation_id = SecureRandom.uuid
      tenant.update!(status: :retiring, retirement_operation_id: operation_id)
      OutboxEvent.create!(tenant_id: tenant.id, event_id: operation_id,
        kind: "tenant.retirement_requested", payload: { actor_id: actor.id })
      { type: :accepted, operation_id: }
    end
  end
end

raise unless RetireTenant.instance_method(:call).parameters == [[:keyreq, :tenant], [:keyreq, :actor]]
puts "AUDITABLE_RETIREMENT_DEFINED"` },
  ],
  "Transações, locks e concorrência": [
    { lang: "ruby", purpose: "UPDATE condicional decide a última vaga no banco e outbox nasce na mesma transação.", code: `class ReserveSeat
  def call(command)
    Reservation.transaction do
      changed = Show.where(id: command.show_id, tenant_id: command.tenant_id)
        .where("available >= ?", command.quantity)
        .update_all(["available = available - ?", command.quantity])
      return { type: :sold_out } unless changed == 1

      reservation = Reservation.create!(command.to_h.merge(status: :pending))
      OutboxEvent.create!(tenant_id: command.tenant_id, event_id: reservation.event_id,
        kind: "reservation.created", aggregate_id: reservation.id)
      { type: :created, id: reservation.id, event_id: reservation.event_id }
    end
  end
end` },
    { lang: "ruby", purpose: "Claim com skip locked limita lote e fence impede worker atrasado de confirmar outro lease.", code: `class OutboxClaimer
  def claim(worker_id:, now:, limit: 20)
    OutboxEvent.transaction do
      rows = OutboxEvent.where(status: :pending).where("available_at <= ?", now)
        .order(:available_at, :id).limit(limit).lock("FOR UPDATE SKIP LOCKED")
      rows.map do |event|
        fence = event.fence + 1
        event.update!(status: :claimed, owner: worker_id, fence:, lease_until: now + 30.seconds)
        { id: event.id, event_id: event.event_id, fence: }
      end
    end
  end

  def acknowledge(id:, worker_id:, fence:, receipt:)
    OutboxEvent.where(id:, owner: worker_id, fence:, status: :claimed)
      .update_all(status: :sent, receipt:, owner: nil, lease_until: nil) == 1
  end
end` },
  ],
  "Relations, scopes e SQL seguro": [
    { lang: "ruby", purpose: "Repository começa pelo tenant e traduz sort público para cláusulas fixas com binds para valores.", code: `class ReservationQuery
  SORTS = {
    "recent" => { created_at: :desc, id: :desc },
    "oldest" => { created_at: :asc, id: :asc }
  }.freeze

  def initialize(tenant_id:) = @tenant_id = tenant_id
  def search(status:, phrase:, sort:)
    order = SORTS.fetch(sort) { raise ArgumentError, "unsupported sort" }
    pattern = "%#{ActiveRecord::Base.sanitize_sql_like(phrase)}%"
    Reservation.where(tenant_id: @tenant_id, status:).where("reference LIKE ?", pattern).order(order)
  end
end

raise unless ReservationQuery::SORTS.keys == %w[recent oldest]
puts "SCOPED_BOUND_QUERY_DEFINED"` },
    { lang: "ruby", purpose: "Bulk expiration mantém tenant e precondition no SQL e retorna affected rows observável.", code: `class ExpirePending
  def call(tenant_id:, before:, limit:)
    ids = Reservation.where(tenant_id:, status: :pending)
      .where("expires_at < ?", before).order(:expires_at, :id).limit(limit).pluck(:id)
    return { expired: 0 } if ids.empty?

    changed = Reservation.where(tenant_id:, id: ids, status: :pending)
      .update_all(status: "expired", expired_at: Time.current, updated_at: Time.current)
    { expired: changed }
  end
end

raise unless ExpirePending.instance_method(:call).parameters.map(&:last) == %i[tenant_id before limit]
puts "BOUNDED_BULK_UPDATE_DEFINED"` },
  ],
  "N+1, eager loading e projeções": [
    { lang: "ruby", purpose: "Read model projeta somente campos públicos e preloads o grafo usado pelo presenter.", code: `ReservationRow = Data.define(:id, :show_title, :quantity, :status, :created_at)

class ReservationReadModel
  def self.for_tenant(tenant_id:, limit: 50)
    Reservation.where(tenant_id:).includes(:show).strict_loading
      .order(created_at: :desc, id: :desc).limit(limit).map do |reservation|
        ReservationRow.new(id: reservation.id.to_s, show_title: reservation.show.title,
          quantity: reservation.quantity, status: reservation.status,
          created_at: reservation.created_at.iso8601(3))
      end
  end
end

raise unless ReservationRow.members == %i[id show_title quantity status created_at]
puts "EXPLICIT_READ_MODEL_DEFINED"` },
    { lang: "ruby", purpose: "Subscriber mede templates SQL durante o bloco para tornar crescimento N+1 testável.", code: `def counted_queries
  count = 0
  callback = lambda do |_name, _start, _finish, _id, payload|
    sql = payload[:sql].to_s
    count += 1 unless payload[:name] == "SCHEMA" || sql.match?(/\A(?:BEGIN|COMMIT|ROLLBACK)/)
  end
  ActiveSupport::Notifications.subscribed(callback, "sql.active_record") { yield }
  count
end

queries = counted_queries { Reservation.limit(20).preload(:show).map { _1.show.title } }
raise "query budget exceeded: #{queries}" unless queries <= 2
puts "QUERY_BUDGET_OK"` },
  ],
  "Paginação, batches e cursores": [
    { lang: "ruby", purpose: "Keyset usa ordem total e predicate composto em vez de offset instável.", code: `class ReservationPage
  def self.fetch(tenant_id:, before_time: nil, before_id: nil, limit: 50)
    raise ArgumentError unless limit.between?(1, 100)
    scope = Reservation.where(tenant_id:).order(created_at: :desc, id: :desc)
    if before_time && before_id
      scope = scope.where("created_at < ? OR (created_at = ? AND id < ?)",
        before_time, before_time, before_id)
    end
    rows = scope.limit(limit + 1).to_a
    { items: rows.first(limit), has_more: rows.length > limit }
  end
end

raise unless ReservationPage.method(:fetch).parameters.any? { _1.last == :tenant_id }
puts "TOTAL_ORDER_KEYSET_DEFINED"` },
    { lang: "ruby", purpose: "Cursor assinado vincula tenant, filtros e versão e rejeita troca de contexto.", code: `class PageCursor
  def initialize(verifier) = @verifier = verifier
  def encode(tenant:, filter:, created_at:, id:)
    @verifier.generate({ v: 1, tenant:, filter:, created_at: created_at.iso8601(6), id: },
      purpose: :reservation_page, expires_in: 15.minutes)
  end
  def decode(token, tenant:, filter:)
    data = @verifier.verify(token, purpose: :reservation_page)
    raise ArgumentError, "cursor context" unless data.fetch("v") == 1 &&
      data.fetch("tenant") == tenant && data.fetch("filter") == filter
    [Time.iso8601(data.fetch("created_at")), data.fetch("id")]
  end
end

raise unless PageCursor.instance_method(:decode).parameters.map(&:last).include?(:tenant)
puts "SCOPED_CURSOR_DEFINED"` },
  ],
  "Índices, cache e contadores": [
    { lang: "ruby", purpose: "Chave de cache inclui namespace, tenant, policy e versão de representação.", code: `module ReservationCacheKey
  module_function
  VERSION = 3
  def build(tenant_id:, reservation:, policy_version:)
    ["chiron", "reservation", VERSION, tenant_id, policy_version,
     reservation.id, reservation.cache_key_with_version].join(":")
  end
end

record = Struct.new(:id, :cache_key_with_version).new(41, "reservations/41-20260916")
alpha = ReservationCacheKey.build(tenant_id: "alpha", reservation: record, policy_version: 7)
beta = ReservationCacheKey.build(tenant_id: "beta", reservation: record, policy_version: 7)
raise if alpha == beta
puts "TENANT_CACHE_NAMESPACE_OK"` },
    { lang: "ruby", purpose: "Reconciliação trata counter cache como derivado e corrige drift com update atômico auditável.", code: `class ReconcileReservationCount
  def call(show_id:, tenant_id:)
    Show.transaction do
      show = Show.where(id: show_id, tenant_id:).lock.first!
      actual = Reservation.where(show_id:, tenant_id:).count
      previous = show.reservations_count
      show.update_columns(reservations_count: actual, updated_at: Time.current) if previous != actual
      AuditEvent.create!(tenant_id:, action: "reservation_count.reconciled",
        target_id: show.id, metadata: { previous:, actual: })
      { previous:, actual:, changed: previous != actual }
    end
  end
end

raise unless ReconcileReservationCount.instance_method(:call).parameters.map(&:last) == %i[show_id tenant_id]
puts "COUNTER_RECONCILIATION_DEFINED"` },
  ],
  "Authentication e lifecycle de sessão": [
    { lang: "ruby", purpose: "Login uniforme regenera sessão e armazena apenas identidade mínima de conta ativa.", code: `class SessionsController < ApplicationController
  def create
    user = User.find_by(email_normalized: params[:email].to_s.strip.downcase)
    authenticated = user&.active? && user.authenticate(params[:password].to_s)
    unless authenticated
      AuthenticationAudit.failed(request_id: request.request_id, account_hint: "redacted")
      return render json: { code: "invalid_credentials" }, status: :unauthorized
    end

    reset_session
    session[:user_id] = user.id
    session[:auth_version] = user.auth_version
    session[:authenticated_at] = Time.current.to_i
    head :no_content
  end
end` },
    { lang: "ruby", purpose: "Token de recuperação armazena digest, expira e é consumido uma única vez sob lock.", code: `class PasswordReset < ApplicationRecord
  def self.issue!(user:, raw_token:, now: Time.current)
    create!(user:, token_digest: Digest::SHA256.hexdigest(raw_token), expires_at: now + 20.minutes)
  end

  def consume!(raw_token:, now: Time.current)
    with_lock do
      expected = Digest::SHA256.hexdigest(raw_token)
      return :invalid unless ActiveSupport::SecurityUtils.secure_compare(token_digest, expected)
      return :expired if expires_at <= now
      return :replayed if consumed_at?
      update!(consumed_at: now)
      :accepted
    end
  end
end

raise unless PasswordReset.instance_method(:consume!).parameters.map(&:last) == %i[raw_token now]
puts "SINGLE_USE_RESET_DEFINED"` },
  ],
  "Authorization e multi-tenancy": [
    { lang: "ruby", purpose: "Repository exige tenant e nunca carrega globalmente antes da policy.", code: `class ReservationRepository
  def initialize(tenant_id:) = @tenant_id = tenant_id

  def find_authorized!(id:, actor:)
    reservation = Reservation.where(tenant_id: @tenant_id).find(id)
    raise NotAuthorized unless ReservationPolicy.new(actor, reservation).show?
    reservation
  end

  def page_for(actor:, limit: 50)
    authorized = ReservationPolicy::Scope.new(actor,
      Reservation.where(tenant_id: @tenant_id)).resolve
    authorized.order(created_at: :desc, id: :desc).limit(limit)
  end
end

raise unless ReservationRepository.instance_method(:initialize).parameters == [[:keyreq, :tenant_id]]
puts "TENANT_FIRST_REPOSITORY_DEFINED"` },
    { lang: "ruby", purpose: "Job carrega contexto emitido pelo servidor e reautoriza membership antes de exportar.", code: `class ExportReservationsJob < ApplicationJob
  queue_as :exports

  def perform(tenant_id:, actor_id:, export_id:, authorization_version:)
    actor = User.find(actor_id)
    membership = Membership.active.find_by!(tenant_id:, user_id: actor.id)
    raise StaleAuthorization unless membership.version == authorization_version

    export = Export.where(tenant_id:).find(export_id)
    raise NotAuthorized unless ExportPolicy.new(actor, export).run?
    ExportReservations.new(tenant_id:, export:).call
  ensure
    Current.reset
  end
end

raise unless ExportReservationsJob.instance_method(:perform).parameters.map(&:last).include?(:tenant_id)
puts "JOB_REAUTHORIZATION_DEFINED"` },
  ],
  "Injection, uploads e SSRF": [
    { lang: "ruby", purpose: "Sort e filtro públicos são traduzidos para estrutura fechada e binds.", code: `class SafeReservationSearch
  ORDERS = {
    "recent" => { created_at: :desc, id: :desc },
    "quantity" => { quantity: :asc, id: :asc }
  }.freeze

  def call(tenant_id:, query:, sort:)
    order = ORDERS.fetch(sort) { raise ArgumentError, "invalid sort" }
    escaped = ActiveRecord::Base.sanitize_sql_like(query.to_s.byteslice(0, 100))
    Reservation.where(tenant_id:).where("reference LIKE ?", "%#{escaped}%").order(order).limit(100)
  end
end

raise unless SafeReservationSearch::ORDERS.keys == %w[recent quantity]
puts "SQL_STRUCTURE_ALLOWLIST_OK"` },
    { lang: "ruby", purpose: "Política de destino aceita apenas HTTPS e hosts cadastrados antes do cliente aplicar egress controls.", code: `class OutboundDestination
  ALLOWED = { "hooks.partner.example" => [443] }.freeze

  def self.parse!(raw)
    raise ArgumentError, "URL too long" if raw.to_s.bytesize > 2_048
    uri = URI.parse(raw)
    port = uri.port
    raise ArgumentError, "scheme" unless uri.scheme == "https"
    raise ArgumentError, "credentials" if uri.user || uri.password
    raise ArgumentError, "destination" unless ALLOWED.fetch(uri.host, []).include?(port)
    raise ArgumentError, "fragment" if uri.fragment
    uri
  rescue URI::InvalidURIError, KeyError
    raise ArgumentError, "invalid destination"
  end
end

raise unless OutboundDestination.parse!("https://hooks.partner.example/events").host == "hooks.partner.example"
begin OutboundDestination.parse!("http://127.0.0.1/latest"); raise
rescue ArgumentError then puts "OUTBOUND_ALLOWLIST_OK" end` },
  ],
  "Secrets, headers e supply chain": [
    { lang: "ruby", purpose: "Configuração valida presença e formato sem imprimir o segredo em erro ou inspeção.", code: `class SecretReference
  attr_reader :key_id
  def initialize(env:, name:, key_id:)
    @value = env.fetch(name) { raise KeyError, "missing secret #{name}" }
    raise ArgumentError, "invalid secret #{name}" if @value.bytesize < 32
    @key_id = key_id.freeze
  end
  def reveal = @value
  def inspect = "#<SecretReference key_id=#{key_id.inspect} value=[FILTERED]>"
end

secret = SecretReference.new(env: { "API_SECRET" => "s" * 40 }, name: "API_SECRET", key_id: "provider-2026-09")
raise if secret.inspect.include?(secret.reveal)
raise unless secret.key_id == "provider-2026-09"
puts "SECRET_REDACTION_OK"` },
    { lang: "ruby", purpose: "Evento estruturado usa allowlist e rejeita campos secretos antes do logger.", code: `module SafeEvent
  ALLOWED = %i[event request_id artifact_id stage outcome duration_bucket].freeze
  FORBIDDEN = /token|secret|password|authorization|cookie/i
  module_function

  def build(fields)
    unknown = fields.keys - ALLOWED
    raise ArgumentError, "unknown fields" unless unknown.empty?
    raise ArgumentError, "secret-shaped key" if fields.keys.any? { FORBIDDEN.match?(_1.to_s) }
    fields.transform_values { |value| value.to_s.byteslice(0, 128) }.freeze
  end
end

event = SafeEvent.build(event: :reservation_created, request_id: "req-7",
  artifact_id: "sha256:abc", stage: :committed, outcome: :created, duration_bucket: :lt_100ms)
raise unless event.frozen?
puts "SAFE_STRUCTURED_EVENT_OK"` },
  ],
  "Active Job e adapters": [
    { lang: "ruby", purpose: "Job recebe apenas identidades versionadas, recarrega pelo tenant e rejeita payload futuro.", code: `class ReconcileReservationJob < ApplicationJob
  queue_as :reconciliation

  def perform(tenant_id:, event_id:, payload_version: 1)
    raise ArgumentError, "unsupported payload" unless payload_version == 1
    event = OutboxEvent.where(tenant_id:).find_by!(event_id:)
    return if event.sent?
    ReconcileReservation.new(tenant_id:).call(event:)
  ensure
    Current.reset
  end
end

parameters = ReconcileReservationJob.instance_method(:perform).parameters.map(&:last)
raise unless parameters.include?(:tenant_id) && parameters.include?(:event_id)
puts "VERSIONED_JOB_ARGUMENTS_OK"` },
    { lang: "ruby", purpose: "Contrato de worker registra outcome bounded sem serializar argumentos sensíveis.", code: `class InstrumentedJob < ApplicationJob
  around_perform do |job, block|
    started = Process.clock_gettime(Process::CLOCK_MONOTONIC)
    outcome = "succeeded"
    begin
      block.call
    rescue Exception
      outcome = "failed"
      raise
    ensure
      duration = Process.clock_gettime(Process::CLOCK_MONOTONIC) - started
      Rails.logger.info(event: "job.perform", job_class: job.class.name,
        job_id: job.job_id, queue: job.queue_name, outcome:, duration_bucket: duration < 1 ? "lt_1s" : "gte_1s")
    end
  end
end

raise unless InstrumentedJob < ActiveJob::Base
puts "BOUNDED_JOB_TELEMETRY_DEFINED"` },
  ],
  "Retries, idempotência e descartes": [
    { lang: "ruby", purpose: "Retry cobre apenas indisponibilidade definida e preserva o event ID entre tentativas.", code: `class DeliverReservationJob < ApplicationJob
  retry_on ProviderUnavailable, wait: :polynomially_longer, attempts: 7
  discard_on InvalidProviderAccount do |job, error|
    DeliveryIncident.record!(event_id: job.arguments.first.fetch("event_id"), code: error.code)
  end

  def perform(tenant_id:, event_id:)
    event = OutboxEvent.where(tenant_id:).find_by!(event_id:)
    result = ReservationProvider.new(tenant_id:).deliver(event:, idempotency_key: event.event_id)
    DeliveryResultRecorder.new(event:).record!(result)
  end
end

raise unless DeliverReservationJob.instance_method(:perform).parameters.map(&:last) == %i[tenant_id event_id]
puts "CLASSIFIED_RETRY_DEFINED"` },
    { lang: "ruby", purpose: "Classificador preserva Unknown quando o provider pode ter aplicado antes do timeout.", code: `module DeliveryDecision
  module_function
  def for(observation)
    case observation
    in { stage: :before_send, error: :unavailable } then :retry_same_event_id
    in { stage: :response, status: 429 } then :retry_with_backoff
    in { stage: :response, status: 400..499 } then :permanent_failure
    in { stage: :after_send, error: :timeout } then :reconcile_unknown
    in { receipt: String } then :record_applied
    else :escalate
    end
  end
end

raise unless DeliveryDecision.for(stage: :after_send, error: :timeout) == :reconcile_unknown
raise unless DeliveryDecision.for(stage: :before_send, error: :unavailable) == :retry_same_event_id
puts "DELIVERY_STAGE_CLASSIFICATION_OK"` },
  ],
  "Commit, outbox e entrega": [
    { lang: "ruby", purpose: "Reserva e evento outbox são persistidos na mesma transação sem enqueue externo antecipado.", code: `class CreateReservation
  def call(command)
    Reservation.transaction do
      reservation = Reservation.create!(tenant_id: command.tenant_id, show_id: command.show_id,
        quantity: command.quantity, idempotency_key: command.idempotency_key,
        event_id: command.event_id, fingerprint: command.fingerprint, status: :pending)
      OutboxEvent.create!(tenant_id: command.tenant_id, event_id: command.event_id,
        aggregate_type: "Reservation", aggregate_id: reservation.id,
        kind: "reservation.created", schema_version: 1,
        payload: { reservation_id: reservation.id, quantity: reservation.quantity })
      { type: :created, reservation_id: reservation.id, event_id: command.event_id }
    end
  end
end

raise unless CreateReservation.instance_method(:call).parameters == [[:req, :command]]
puts "ATOMIC_OUTBOX_DEFINED"` },
    { lang: "ruby", purpose: "Acknowledge condicionado por owner e fence impede worker atrasado de sobrescrever lease novo.", code: `class OutboxDelivery
  def self.acknowledge(id:, owner:, fence:, receipt:, now: Time.current)
    changed = OutboxEvent.where(id:, owner:, fence:, status: :claimed)
      .where("lease_until >= ?", now)
      .update_all(status: "sent", receipt:, sent_at: now, owner: nil, lease_until: nil)
    changed == 1
  end

  def self.mark_unknown(id:, owner:, fence:, reason:)
    OutboxEvent.where(id:, owner:, fence:, status: :claimed)
      .update_all(status: "unknown", error_code: reason, owner: nil, lease_until: nil) == 1
  end
end

raise unless OutboxDelivery.method(:acknowledge).parameters.map(&:last).include?(:fence)
puts "FENCED_ACK_DEFINED"` },
  ],
  "Mailer, Cable e notificações": [
    { lang: "ruby", purpose: "Mailer recarrega recipient escopado e gera URL a partir de host confiável configurado.", code: `class ReservationMailer < ApplicationMailer
  def confirmed(tenant_id:, reservation_id:, event_id:)
    @reservation = Reservation.where(tenant_id:).includes(:user, :show).find(reservation_id)
    raise "event mismatch" unless @reservation.event_id == event_id
    @url = reservation_url(@reservation, host: Rails.configuration.public_host,
      protocol: "https")
    mail(to: @reservation.user.email, subject: I18n.t!("mail.reservation.confirmed.subject"),
      message_id: "<#{event_id}@#{Rails.configuration.public_host}>")
  end
end

raise unless ReservationMailer.instance_method(:confirmed).parameters.map(&:last).include?(:tenant_id)
puts "SCOPED_MAILER_DEFINED"` },
    { lang: "ruby", purpose: "Channel ignora tenant fornecido pelo cliente e autoriza stream a partir da conexão autenticada.", code: `class ReservationsChannel < ApplicationCable::Channel
  def subscribed
    reservation = Reservation.where(tenant_id: current_identity.tenant_id).find(params.fetch(:id))
    reject unless ReservationPolicy.new(current_identity.actor, reservation).show?
    stream_for reservation
  rescue ActiveRecord::RecordNotFound
    reject
  end

  def refresh(data)
    reservation = Reservation.where(tenant_id: current_identity.tenant_id).find(data.fetch("id"))
    reject unless ReservationPolicy.new(current_identity.actor, reservation).show?
    transmit ReservationPresenter.new(reservation).as_json
  end
end

raise unless ReservationsChannel < ApplicationCable::Channel
puts "TENANT_SCOPED_CHANNEL_DEFINED"` },
  ],
  "Templates, helpers e XSS": [
    { lang: "ruby", purpose: "Helper constrói markup por APIs de tag e mantém conteúdo do usuário escapado.", code: `module ReservationHelper
  STATUS_CLASSES = {
    "pending" => "status status--pending",
    "confirmed" => "status status--confirmed",
    "cancelled" => "status status--cancelled"
  }.freeze

  def reservation_status_badge(reservation)
    css = STATUS_CLASSES.fetch(reservation.status) { "status status--unknown" }
    tag.span(I18n.t!("reservations.status.#{reservation.status}"),
      class: css, data: { reservation_id: reservation.id })
  end
end

raise unless ReservationHelper::STATUS_CLASSES.keys.sort == %w[cancelled confirmed pending]
puts "CONTEXTUAL_TAG_HELPER_DEFINED"` },
    { lang: "ruby", purpose: "Rich text passa por allowlist pequena e links recebem atributos defensivos.", code: `module SafeRichText
  ALLOWED_TAGS = %w[p br strong em ul ol li a].freeze
  ALLOWED_ATTRIBUTES = %w[href title].freeze
  module_function

  def render(view, input)
    cleaned = view.sanitize(input.to_s, tags: ALLOWED_TAGS, attributes: ALLOWED_ATTRIBUTES)
    fragment = Nokogiri::HTML5.fragment(cleaned)
    fragment.css("a").each do |link|
      uri = URI.parse(link["href"].to_s) rescue nil
      link.remove_attribute("href") unless uri && [nil, "https"].include?(uri.scheme)
      link["rel"] = "nofollow noopener"
    end
    fragment.to_html.html_safe
  end
end

raise unless SafeRichText::ALLOWED_TAGS.exclude?("script")
puts "RICH_TEXT_POLICY_DEFINED"` },
  ],
  "Turbo Drive, Frames e Streams": [
    { lang: "ruby", purpose: "Create responde com redirect 303 ou validation 422 sem antecipar sucesso.", code: `class ReservationsController < ApplicationController
  def create
    result = ReserveSeat.new.call(command_from_request)
    case result
    in { type: :created, reservation: }
      redirect_to reservation_path(reservation), status: :see_other,
        notice: I18n.t!("reservations.created")
    in { type: :invalid, errors: }
      @reservation = ReservationForm.from_errors(errors)
      render :new, status: :unprocessable_entity
    in { type: :conflict }
      render "shared/conflict", status: :conflict
    else
      raise UnmappedOutcome
    end
  end
end

raise unless ReservationsController < ApplicationController
puts "TURBO_HTTP_SEMANTICS_DEFINED"` },
    { lang: "ruby", purpose: "Stream usa DOM ID estável e replace tolera entrega repetida sem duplicar o recurso.", code: `class ReservationStream
  def self.render(view:, reservation:)
    Turbo::Streams::TagBuilder.new(view).replace(
      ActionView::RecordIdentifier.dom_id(reservation),
      partial: "reservations/reservation",
      locals: { reservation: }
    )
  end
end

record = Struct.new(:to_key, :model_name).new([41], Reservation.model_name)
dom_id = ActionView::RecordIdentifier.dom_id(record)
raise unless dom_id.end_with?("_41")
puts "IDEMPOTENT_STREAM_TARGET_OK"` },
  ],
  "Stimulus e assets": [
    { lang: "ruby", purpose: "View expõe somente configuração pública limitada ao controller Stimulus.", code: `module CountdownComponent
  module_function
  def attributes(view, expires_at:)
    seconds = [(expires_at - Time.current).ceil, 0].max
    raise ArgumentError, "countdown too long" if seconds > 86_400
    {
      data: {
        controller: "countdown",
        countdown_seconds_value: seconds,
        action: "turbo:before-cache->countdown#disconnect"
      },
      role: "timer",
      "aria-live": "polite"
    }
  end
end

attrs = CountdownComponent.attributes(nil, expires_at: Time.current + 60)
raise unless attrs[:data][:countdown_seconds_value].between?(0, 60)
puts "PUBLIC_STIMULUS_CONFIG_OK"` },
    { lang: "ruby", purpose: "Manifest gate exige digests e recusa referências móveis no artefato de assets.", code: `module AssetManifestGate
  DIGEST = /-[0-9a-f]{16,}\.[a-z0-9]+\z/i
  module_function
  def verify!(manifest)
    raise "empty manifest" if manifest.empty?
    manifest.each do |logical, compiled|
      raise "unsafe logical path" if logical.include?("..")
      raise "asset without digest: #{compiled}" unless DIGEST.match?(compiled)
      raise "moving remote asset" if compiled.start_with?("http://", "https://")
    end
    true
  end
end

raise unless AssetManifestGate.verify!({ "application.js" => "application-0123456789abcdef.js" })
puts "IMMUTABLE_ASSET_MANIFEST_OK"` },
  ],
  "I18n, tempo e acessibilidade": [
    { lang: "ruby", purpose: "Agendamento converte tempo local na zona explícita e guarda instante UTC mais a zona de negócio.", code: `ScheduledOccurrence = Data.define(:starts_at_utc, :time_zone)

def schedule(local_iso:, time_zone:)
  zone = ActiveSupport::TimeZone[time_zone]
  raise ArgumentError, "unknown zone" unless zone
  local = zone.parse(local_iso)
  raise ArgumentError, "invalid local time" unless local
  ScheduledOccurrence.new(starts_at_utc: local.utc, time_zone: zone.tzinfo.name).freeze
end

occurrence = schedule(local_iso: "2026-09-16 19:30", time_zone: "America/Sao_Paulo")
raise unless occurrence.starts_at_utc.utc? && occurrence.time_zone == "America/Sao_Paulo"
puts "EXPLICIT_TIME_ZONE_OK"` },
    { lang: "ruby", purpose: "Formulário liga summary, labels e mensagens aos campos para navegação por teclado e leitor.", code: `module AccessibleErrors
  module_function
  def summary(view, object)
    return "".html_safe if object.errors.empty?
    items = object.errors.map do |error|
      field_id = "reservation_#{error.attribute}"
      view.tag.li(view.link_to(error.full_message, "##{field_id}"))
    end
    view.tag.div(role: "alert", tabindex: "-1", id: "form-errors") do
      view.safe_join([view.tag.h2(I18n.t!("errors.summary")), view.tag.ul(view.safe_join(items))])
    end
  end
end

raise unless AccessibleErrors.respond_to?(:summary)
puts "ACCESSIBLE_ERROR_SUMMARY_DEFINED"` },
  ],
  "JSON APIs e versionamento": [
    { lang: "ruby", purpose: "Serializer público usa allowlist e representação estável independente das colunas do model.", code: `class Api::V1::ReservationSerializer
  def initialize(reservation) = @reservation = reservation
  def as_json
    {
      type: "reservation",
      id: @reservation.id.to_s,
      attributes: {
        show_id: @reservation.show_id.to_s,
        quantity: @reservation.quantity,
        status: @reservation.status,
        created_at: @reservation.created_at.iso8601(3)
      }
    }
  end
end

public_keys = Api::V1::ReservationSerializer.instance_methods(false)
raise unless public_keys == [:as_json] || public_keys.sort == %i[as_json]
puts "VERSIONED_SERIALIZER_DEFINED"` },
    { lang: "ruby", purpose: "PATCH aplica versão esperada e distingue campo ausente de null explícito.", code: `class UpdateReservation
  ALLOWED = %w[note].freeze
  def call(reservation:, payload:, expected_version:)
    unknown = payload.keys - ALLOWED
    raise ArgumentError, "unknown fields" unless unknown.empty?
    reservation.with_lock do
      return { type: :conflict, version: reservation.lock_version } unless reservation.lock_version == expected_version
      changes = {}
      changes[:note] = payload["note"] if payload.key?("note")
      reservation.update!(changes)
      { type: :updated, version: reservation.lock_version }
    end
  end
end

raise unless UpdateReservation::ALLOWED == ["note"]
puts "CONDITIONAL_PATCH_DEFINED"` },
  ],
  "Clientes HTTP e deadlines": [
    { lang: "ruby", purpose: "Adapter traduz response e falhas de estágio em outcomes sem retry cego.", code: `module ProviderOutcome
  module_function
  def classify(status:, body:, stage: :response)
    return { type: :unknown } if stage == :after_send_timeout
    return { type: :retryable } if status == 429 || status.between?(500, 599)
    return { type: :permanent } if status.between?(400, 499)
    return { type: :invalid_response } unless status.between?(200, 299) && body.is_a?(Hash)
    receipt = body["receipt_id"]
    receipt.is_a?(String) && receipt.bytesize.between?(1, 128) ? { type: :applied, receipt: } : { type: :invalid_response }
  end
end

raise unless ProviderOutcome.classify(status: 0, body: nil, stage: :after_send_timeout)[:type] == :unknown
raise unless ProviderOutcome.classify(status: 429, body: {})[:type] == :retryable
puts "PROVIDER_OUTCOME_CLASSIFICATION_OK"` },
    { lang: "ruby", purpose: "Deadline reparte orçamento entre connect/read e conserva idempotency key estável.", code: `class ProviderRequest
  def initialize(client:, clock: Process.method(:clock_gettime))
    @client = client
    @clock = clock
  end
  def deliver(event:, deadline_seconds:)
    started = @clock.call(Process::CLOCK_MONOTONIC)
    remaining = -> { deadline_seconds - (@clock.call(Process::CLOCK_MONOTONIC) - started) }
    raise ProviderUnavailable if remaining.call <= 0
    @client.post("/v1/reservations", json: event.payload,
      headers: { "Idempotency-Key" => event.event_id },
      connect_timeout: [remaining.call, 1.0].min,
      read_timeout: [remaining.call, 3.0].min)
  end
end

raise unless ProviderRequest.instance_method(:deliver).parameters.map(&:last) == %i[event deadline_seconds]
puts "DEADLINE_AWARE_REQUEST_DEFINED"` },
  ],
  "Webhooks e callbacks": [
    { lang: "ruby", purpose: "Verifier autentica os bytes originais, timestamp e digest antes de parsear JSON.", code: `class WebhookVerifier
  WINDOW = 5.minutes
  def initialize(secret:, clock: -> { Time.current }) = (@secret, @clock = secret, clock)
  def verify!(raw_body:, timestamp:, signature:)
    sent_at = Time.at(Integer(timestamp, 10), in: "UTC")
    raise InvalidSignature if (@clock.call - sent_at).abs > WINDOW
    expected = OpenSSL::HMAC.hexdigest("SHA256", @secret, "#{timestamp}.#{raw_body}")
    raise InvalidSignature unless signature.bytesize == expected.bytesize &&
      ActiveSupport::SecurityUtils.secure_compare(signature, expected)
    JSON.parse(raw_body)
  rescue JSON::ParserError, ArgumentError
    raise InvalidSignature
  end
end

raise unless WebhookVerifier::WINDOW == 5.minutes
puts "RAW_WEBHOOK_VERIFIER_DEFINED"` },
    { lang: "ruby", purpose: "Inbox deduplica por conta do provider e event ID antes de produzir trabalho.", code: `class AcceptWebhook
  def call(integration:, event:)
    ProviderInbox.transaction do
      inbox = ProviderInbox.create_or_find_by!(provider_account_id: integration.provider_account_id,
        event_id: event.fetch("id")) do |row|
        row.tenant_id = integration.tenant_id
        row.event_type = event.fetch("type")
        row.schema_version = event.fetch("version", 1)
        row.payload_digest = Digest::SHA256.hexdigest(JSON.generate(event))
        row.status = :accepted
      end
      return { type: :duplicate, inbox_id: inbox.id } unless inbox.previously_new_record?
      OutboxEvent.create!(tenant_id: integration.tenant_id, event_id: "inbox:#{inbox.id}",
        kind: "provider.webhook.accepted", aggregate_id: inbox.id)
      { type: :accepted, inbox_id: inbox.id }
    end
  end
end

raise unless AcceptWebhook.instance_method(:call).parameters == [[:keyreq, :integration], [:keyreq, :event]]
puts "DURABLE_WEBHOOK_INBOX_DEFINED"` },
  ],
  "Rate limits e quotas": [
    { lang: "ruby", purpose: "Política combina buckets global, tenant e operação com custo fechado.", code: `module RequestCost
  COSTS = { "reservations.create" => 5, "reservations.index" => 1, "exports.create" => 25 }.freeze
  module_function
  def keys(identity:, operation:)
    cost = COSTS.fetch(operation) { raise ArgumentError, "unknown operation" }
    tenant = identity.fetch(:tenant_id)
    [
      { key: "global:#{operation}", cost:, limit: 10_000 },
      { key: "tenant:#{Digest::SHA256.hexdigest(tenant)}:#{operation}", cost:, limit: 1_000 }
    ]
  end
end

keys = RequestCost.keys(identity: { tenant_id: "alpha" }, operation: "exports.create")
raise unless keys.size == 2 && keys.all? { _1[:cost] == 25 }
puts "WEIGHTED_LIMIT_KEYS_OK"` },
    { lang: "ruby", purpose: "Admission valida payload e quota antes de adquirir conexão ou enfileirar export grande.", code: `class ExportAdmission
  MAX_RANGE = 31.days
  MAX_ACTIVE = 2
  def call(identity:, from:, to:)
    raise ArgumentError, "range" unless from <= to && (to - from) <= MAX_RANGE
    active = Export.where(tenant_id: identity.fetch(:tenant_id), status: %i[pending running]).count
    return { type: :quota, retry_after: 60 } if active >= MAX_ACTIVE
    { type: :accepted }
  end
end

raise unless ExportAdmission::MAX_ACTIVE == 2
raise unless ExportAdmission.new.call(identity: { tenant_id: "alpha" },
  from: Time.current - 1.day, to: Time.current)[:type] == :accepted
puts "BOUNDED_EXPORT_ADMISSION_OK"` },
  ],
  "Model, service e contract tests": [
    { lang: "ruby", purpose: "Service test usa oracle completo e prova que provider não é chamado antes da outbox.", code: `class ReserveSeatTest < ActiveSupport::TestCase
  test "persists reservation and outbox without external delivery" do
    store = FakeReservationStore.new(capacity: 1)
    provider = Minitest::Mock.new
    command = ReserveCommand.new(tenant_id: "alpha", show_id: "show-1", quantity: 1,
      idempotency_key: "key-0001", event_id: "event-0001", fingerprint: "fp-v1")

    result = ReserveSeat.new(store:, provider:).call(command)

    assert_equal :created, result.fetch(:type)
    assert_equal 0, store.capacity
    assert_equal ["event-0001"], store.reservations.map(&:event_id)
    assert_equal ["event-0001"], store.outbox.map(&:event_id)
    provider.verify
  end
end` },
    { lang: "ruby", purpose: "Contrato compartilhado exige tenant isolation e replay convergente de toda implementação.", code: `module ReservationRepositoryContract
  def test_same_key_replays_same_identity
    repository = build_repository
    first = repository.reserve(tenant_id: "alpha", key: "key-0001", fingerprint: "fp-1")
    replay = repository.reserve(tenant_id: "alpha", key: "key-0001", fingerprint: "fp-1")
    assert_equal first.fetch(:reservation_id), replay.fetch(:reservation_id)
    assert_equal first.fetch(:event_id), replay.fetch(:event_id)
  end

  def test_identical_keys_are_independent_between_tenants
    repository = build_repository
    alpha = repository.reserve(tenant_id: "alpha", key: "key-0001", fingerprint: "fp-1")
    beta = repository.reserve(tenant_id: "beta", key: "key-0001", fingerprint: "fp-1")
    refute_equal alpha.fetch(:reservation_id), beta.fetch(:reservation_id)
  end
end

raise unless ReservationRepositoryContract.instance_methods.grep(/^test_/).size == 2
puts "REPOSITORY_CONTRACT_DEFINED"` },
  ],
  "Request e system tests": [
    { lang: "ruby", purpose: "Request test verifica contrato HTTP, estado e outbox, não apenas status.", code: `class ReservationsRequestTest < ActionDispatch::IntegrationTest
  test "creates once and replays the same receipt" do
    sign_in users(:alpha_member)
    headers = { "Idempotency-Key" => "key-request-0001", "Content-Type" => "application/json" }
    body = { reservation: { show_id: shows(:alpha).id, quantity: 1 } }.to_json

    assert_difference(["Reservation.count", "OutboxEvent.count"], 1) do
      post "/api/v1/reservations", params: body, headers:
    end
    receipt = response.parsed_body
    assert_no_difference(["Reservation.count", "OutboxEvent.count"]) do
      post "/api/v1/reservations", params: body, headers:
    end
    assert_equal receipt.fetch("id"), response.parsed_body.fetch("id")
  end
end` },
    { lang: "ruby", purpose: "System test exercita double-submit e foco no erro usando semântica acessível.", code: `class ReservationFlowTest < ApplicationSystemTestCase
  test "double submit converges and validation moves focus" do
    sign_in users(:alpha_member)
    visit new_reservation_path
    fill_in "Quantity", with: "0"
    click_button "Reserve"
    assert_selector "#form-errors[role=alert]", focused: true

    fill_in "Quantity", with: "1"
    button = find_button("Reserve")
    button.double_click
    assert_text "Reservation confirmed"
    assert_equal 1, Reservation.where(tenant_id: tenants(:alpha).id,
      idempotency_key: page.find("form")["data-idempotency-key"]).count
  end
end` },
  ],
  "Banco e concorrência determinística": [
    { lang: "ruby", purpose: "Harness usa duas conexões independentes e barrier para provar um vencedor da última vaga.", code: `ready = Queue.new
release = Queue.new
results = Queue.new
threads = 2.times.map do
  Thread.new do
    ActiveRecord::Base.connection_pool.with_connection do |connection|
      ready << connection.raw_connection.object_id
      release.pop
      result = ReserveSeat.new.call(tenant_id: "alpha", show_id: "last-seat", quantity: 1,
        idempotency_key: SecureRandom.uuid)
      results << result.fetch(:type)
    end
  end
end
connection_ids = 2.times.map { ready.pop }
raise unless connection_ids.uniq.size == 2
2.times { release << true }; threads.each(&:join)
raise unless 2.times.map { results.pop }.tally == { created: 1, sold_out: 1 }
raise unless Show.find_by!(external_id: "last-seat").available.zero?
puts "TWO_SESSION_LAST_SEAT_OK"` },
    { lang: "ruby", purpose: "Acknowledge atrasado falha depois que um novo owner incrementa o fence.", code: `event = OutboxEvent.create!(event_id: "event-fence-1", tenant_id: "alpha", status: :pending, fence: 0)
first = OutboxClaimer.new.claim(worker_id: "worker-a", now: Time.current, limit: 1).first
event.update!(lease_until: 1.minute.ago)
second = OutboxClaimer.new.claim(worker_id: "worker-b", now: Time.current, limit: 1).first

raise unless second.fetch(:fence) > first.fetch(:fence)
stale_ack = OutboxDelivery.acknowledge(id: event.id, owner: "worker-a",
  fence: first.fetch(:fence), receipt: "late", now: Time.current)
raise if stale_ack
fresh_ack = OutboxDelivery.acknowledge(id: event.id, owner: "worker-b",
  fence: second.fetch(:fence), receipt: "receipt-1", now: Time.current)
raise unless fresh_ack
puts "STALE_FENCE_REJECTED"` },
  ],
  "Property, mutation e fuzz": [
    { lang: "ruby", purpose: "Property gera replays equivalentes e divergentes preservando identidade e estado.", code: `PROPERTY_RUNS = 200
rng = Random.new(41)
PROPERTY_RUNS.times do |index|
  tenant = "tenant-#{rng.rand(1..4)}"
  key = "key-#{index}"
  quantity = rng.rand(1..8)
  repository = FakeReservationRepository.new(capacity: 20)
  first = repository.reserve(tenant_id: tenant, key:, quantity:)
  equal = repository.reserve(tenant_id: tenant, key:, quantity:)
  divergent = repository.reserve(tenant_id: tenant, key:, quantity: quantity == 8 ? 7 : quantity + 1)
  raise unless equal[:reservation_id] == first[:reservation_id]
  raise unless divergent[:type] == :conflict
  raise unless repository.capacity == 20 - quantity
end
puts "REPLAY_PROPERTY_OK seed=41 runs=#{PROPERTY_RUNS}"` },
    { lang: "ruby", purpose: "Fuzz target limita bytes antes do parse e exige erro bounded sem side effects.", code: `def fuzz_cursor(bytes, verifier:, effects:)
  return :too_large if bytes.bytesize > 2_048
  token = bytes.dup.force_encoding(Encoding::UTF_8)
  return :invalid_encoding unless token.valid_encoding?
  PageCursor.new(verifier).decode(token, tenant: "alpha", filter: "active")
  :accepted
rescue ActiveSupport::MessageVerifier::InvalidSignature, ArgumentError, KeyError
  :invalid
ensure
  raise "fuzz caused an effect" unless effects.empty?
end

verifier = ActiveSupport::MessageVerifier.new("f" * 64, serializer: JSON)
effects = []
1_000.times do
  bytes = Random.bytes(rand(0..256))
  result = fuzz_cursor(bytes, verifier:, effects:)
  raise unless %i[accepted invalid invalid_encoding too_large].include?(result)
end
puts "BOUNDED_CURSOR_FUZZ_OK"` },
  ],
  "Instrumentation, logs e traces": [
    { lang: "ruby", purpose: "Evento instrumentado usa payload bounded e registra outcome inclusive quando há exceção.", code: `module ReservationInstrumentation
  ALLOWED_OUTCOMES = %w[created replayed conflict sold_out unknown failed].freeze
  module_function
  def instrument(event_id:, artifact_id:)
    outcome = "failed"
    result = nil
    ActiveSupport::Notifications.instrument("reservation.reserve.chiron",
      event_id:, artifact_id:, stage: "application") do |payload|
      result = yield
      outcome = result.fetch(:type).to_s
      raise "unbounded outcome" unless ALLOWED_OUTCOMES.include?(outcome)
      payload[:outcome] = outcome
    ensure
      payload[:outcome] ||= outcome
    end
    result
  end
end

raise unless ReservationInstrumentation::ALLOWED_OUTCOMES.include?("unknown")
puts "BOUNDED_INSTRUMENTATION_DEFINED"` },
    { lang: "ruby", purpose: "Logger estruturado aceita somente campos seguros e limita comprimento antes do sink.", code: `module OperationalEvent
  FIELDS = %i[event request_id trace_id event_id artifact_id stage outcome duration_bucket].freeze
  FORBIDDEN = /password|token|authorization|cookie|secret|body|params/i
  module_function
  def build(attributes)
    unknown = attributes.keys - FIELDS
    raise ArgumentError, "unknown fields" unless unknown.empty?
    raise ArgumentError, "secret-shaped key" if attributes.keys.any? { FORBIDDEN.match?(_1.to_s) }
    attributes.transform_values { _1.to_s.encode("UTF-8", invalid: :replace).byteslice(0, 128) }.freeze
  end
end

event = OperationalEvent.build(event: "outbox.send", event_id: "event-41",
  artifact_id: "sha256:abc", stage: "after_send", outcome: "unknown")
raise unless event.frozen? && event[:outcome] == "unknown"
puts "SAFE_OPERATIONAL_EVENT_OK"` },
  ],
  "Caching e invalidação": [
    { lang: "ruby", purpose: "Cache key inclui tenant, policy, locale, schema e versão do recurso.", code: `module ReservationCache
  SCHEMA_VERSION = 4
  module_function
  def key(tenant_id:, policy_version:, locale:, reservation:)
    ["chiron", "reservation", SCHEMA_VERSION, Digest::SHA256.hexdigest(tenant_id),
     policy_version, locale, reservation.cache_key_with_version].join(":")
  end
  def fetch(tenant_id:, policy_version:, locale:, reservation:)
    Rails.cache.fetch(key(tenant_id:, policy_version:, locale:, reservation:),
      expires_in: 10.minutes, race_condition_ttl: 5.seconds) { yield }
  end
end

record = Struct.new(:cache_key_with_version).new("reservations/41-20260916")
alpha = ReservationCache.key(tenant_id: "alpha", policy_version: 2, locale: :pt, reservation: record)
beta = ReservationCache.key(tenant_id: "beta", policy_version: 2, locale: :pt, reservation: record)
raise if alpha == beta
puts "CONTEXTUAL_CACHE_KEY_OK"` },
    { lang: "ruby", purpose: "Handler de invalidação é idempotente e usa namespace tenant-scoped sem flush amplo.", code: `class InvalidateReservationCacheJob < ApplicationJob
  def perform(tenant_id:, reservation_id:, representation_version:)
    tenant_digest = Digest::SHA256.hexdigest(tenant_id)
    prefix = ["chiron", "reservation", representation_version, tenant_digest].join(":")
    Rails.cache.delete_matched("#{prefix}:*:reservations/#{reservation_id}-*")
    CacheInvalidationReceipt.create_or_find_by!(tenant_id:, reservation_id:,
      representation_version:)
  end
end

parameters = InvalidateReservationCacheJob.instance_method(:perform).parameters.map(&:last)
raise unless parameters == %i[tenant_id reservation_id representation_version]
puts "SCOPED_INVALIDATION_DEFINED"` },
  ],
  "Puma, processos, threads e pools": [
    { lang: "ruby", purpose: "Configuração falha quando pool de banco não comporta threads previstas por processo.", code: `module ConcurrencyBudget
  module_function
  def verify!(web_threads:, internal_db_users:, db_pool:)
    required = web_threads + internal_db_users
    raise ArgumentError, "DB_POOL=#{db_pool} below required=#{required}" if db_pool < required
    { web_threads:, internal_db_users:, db_pool:, spare: db_pool - required }.freeze
  end
end

budget = ConcurrencyBudget.verify!(web_threads: 5, internal_db_users: 1, db_pool: 8)
raise unless budget[:spare] == 2
begin ConcurrencyBudget.verify!(web_threads: 8, internal_db_users: 2, db_pool: 5); raise
rescue ArgumentError then puts "CONCURRENCY_BUDGET_OK" end` },
    { lang: "ruby", purpose: "Lifecycle de shutdown fecha admissão, drena owners com prazo e encerra pools em ordem.", code: `class ProcessLifecycle
  def initialize(server:, jobs:, telemetry:, pools:)
    @server, @jobs, @telemetry, @pools = server, jobs, telemetry, pools
  end
  def shutdown(deadline:)
    @server.not_ready!
    @server.stop_accepting
    @jobs.stop_fetching
    @server.drain(until_time: deadline)
    @jobs.drain(until_time: deadline)
  ensure
    @telemetry.flush(timeout: 1.0)
    @pools.each(&:close)
  end
end

raise unless ProcessLifecycle.instance_method(:shutdown).parameters == [[:keyreq, :deadline]]
puts "ORDERED_SHUTDOWN_DEFINED"` },
  ],
  "Memória, DoS e overload": [
    { lang: "ruby", purpose: "Middleware rejeita bytes declarados e lidos antes de entregar body ao parser.", code: `class BoundedBody
  MAX_BYTES = 256 * 1024
  def initialize(app) = @app = app
  def call(env)
    declared = Integer(env["CONTENT_LENGTH"].to_s, 10, exception: false)
    return [413, { "Content-Type" => "application/json" }, ['{"code":"payload_too_large"}']] if declared && declared > MAX_BYTES
    input = env.fetch("rack.input")
    bytes = input.read(MAX_BYTES + 1)
    return [413, { "Content-Type" => "application/json" }, ['{"code":"payload_too_large"}']] if bytes.bytesize > MAX_BYTES
    env["rack.input"] = StringIO.new(bytes.freeze)
    @app.call(env)
  end
end

raise unless BoundedBody::MAX_BYTES == 262_144
puts "PRE_PARSE_BODY_LIMIT_DEFINED"` },
    { lang: "ruby", purpose: "Admission lease é bounded e sempre liberado mesmo quando a operação falha.", code: `class AdmissionGate
  def initialize(limit:)
    @slots = SizedQueue.new(limit)
    limit.times { @slots << true }
  end
  def with_slot(wait: 0.05)
    token = Timeout.timeout(wait) { @slots.pop }
    yield
  rescue Timeout::Error
    { type: :overloaded, retry_after: 1 }
  ensure
    @slots << token if token
  end
end

gate = AdmissionGate.new(limit: 1)
raise unless gate.with_slot { { type: :accepted } }[:type] == :accepted
raise unless gate.with_slot { raise "boom" } rescue true
raise unless gate.with_slot { { type: :accepted } }[:type] == :accepted
puts "BOUNDED_ADMISSION_LEASE_OK"` },
  ],
  "Bundler, assets e imagem": [
    { lang: "ruby", purpose: "Gate de artefato exige lock congelado, runtime esperado e manifest de assets digestado.", code: `module ReleaseArtifactGate
  DIGESTED_ASSET = /-[0-9a-f]{16,}\.[a-z0-9]+\z/i
  module_function
  def verify!(lock:, manifest:, expected_ruby:, expected_rails:)
    raise "Ruby mismatch" unless RUBY_VERSION == expected_ruby
    raise "Rails mismatch" unless Rails.version == expected_rails
    parser = Bundler::LockfileParser.new(lock)
    raise "empty lock" if parser.specs.empty?
    raise "empty assets" if manifest.empty?
    manifest.each_value { |path| raise "undigested asset #{path}" unless DIGESTED_ASSET.match?(path) }
    { ruby: RUBY_VERSION, rails: Rails.version, gems: parser.specs.length, assets: manifest.length }.freeze
  end
end

raise unless ReleaseArtifactGate.respond_to?(:verify!)
puts "RELEASE_ARTIFACT_GATE_DEFINED"` },
    { lang: "ruby", purpose: "Boot report expõe somente versões e identificadores seguros do artefato/configuração.", code: `module BootIdentity
  FIELDS = %i[artifact_id ruby_engine ruby_version rails_version schema_version environment].freeze
  module_function
  def build(env:, schema_version:)
    data = {
      artifact_id: env.fetch("ARTIFACT_ID"), ruby_engine: RUBY_ENGINE,
      ruby_version: RUBY_VERSION, rails_version: Rails.version,
      schema_version:, environment: Rails.env.to_s
    }
    raise "unexpected boot fields" unless data.keys == FIELDS
    data.transform_values { _1.to_s.byteslice(0, 128) }.freeze
  end
end

identity = BootIdentity.build(env: { "ARTIFACT_ID" => "sha256:abc" }, schema_version: 202609160001)
raise unless identity[:artifact_id] == "sha256:abc" && identity.frozen?
puts "SAFE_BOOT_IDENTITY_OK"` },
  ],
  "Deploy, migrations e frota mista": [
    { lang: "ruby", purpose: "Aplicação declara faixa de schema compatível e fecha readiness fora dela.", code: `module SchemaCompatibility
  MINIMUM = 202609010001
  MAXIMUM = 202609309999
  module_function
  def verify!(version)
    numeric = Integer(version)
    raise "schema #{numeric} below #{MINIMUM}" if numeric < MINIMUM
    raise "schema #{numeric} above #{MAXIMUM}" if numeric > MAXIMUM
    { compatible: true, version: numeric }.freeze
  end
end

raise unless SchemaCompatibility.verify!(202609160001)[:compatible]
begin SchemaCompatibility.verify!(202610010001); raise
rescue RuntimeError then puts "SCHEMA_COMPATIBILITY_GATE_OK" end` },
    { lang: "ruby", purpose: "Canary gate combina saúde HTTP com invariantes de outbox e efeitos antes de avançar rollout.", code: `CanaryEvidence = Data.define(:requests, :server_errors, :lost_outbox, :duplicate_effects, :p99_ms)

module CanaryGate
  module_function
  def decision(evidence)
    return :insufficient if evidence.requests < 1_000
    return :rollback if evidence.server_errors.fdiv(evidence.requests) > 0.005
    return :rollback if evidence.lost_outbox.positive? || evidence.duplicate_effects.positive?
    return :rollback if evidence.p99_ms > 750
    :advance
  end
end

safe = CanaryEvidence.new(requests: 2_000, server_errors: 1, lost_outbox: 0, duplicate_effects: 0, p99_ms: 220)
unsafe = CanaryEvidence.new(requests: 2_000, server_errors: 0, lost_outbox: 1, duplicate_effects: 0, p99_ms: 100)
raise unless CanaryGate.decision(safe) == :advance && CanaryGate.decision(unsafe) == :rollback
puts "CANARY_CORRECTNESS_GATE_OK"` },
  ],
  "Shutdown, rollback e signals": [
    { lang: "ruby", purpose: "Lifecycle fecha readiness e fetch antes de drenar owners, encerrando pools por último.", code: `class GracefulLifecycle
  def initialize(readiness:, web:, jobs:, cable:, telemetry:, pools:)
    @readiness, @web, @jobs, @cable, @telemetry, @pools = readiness, web, jobs, cable, telemetry, pools
  end
  def stop(deadline:)
    @readiness.close!
    @web.stop_accepting
    @jobs.stop_fetching
    [@web, @jobs, @cable].each { _1.drain(deadline:) }
  ensure
    @telemetry.flush(timeout: 1.0)
    @pools.reverse_each(&:close)
  end
end

raise unless GracefulLifecycle.instance_method(:stop).parameters == [[:keyreq, :deadline]]
puts "GRACEFUL_LIFECYCLE_DEFINED"` },
    { lang: "ruby", purpose: "Stage pós-envio permanece Unknown no shutdown e nunca é convertido em falha repetível.", code: `module ShutdownDeliveryDecision
  module_function
  def classify(stage:, response_received:, provider_receipt: nil)
    return { type: :applied, receipt: provider_receipt } if provider_receipt
    case stage
    when :before_send then { type: :retry_same_event_id }
    when :sending, :after_send then response_received ? { type: :reconcile } : { type: :unknown }
    when :acknowledged then { type: :already_recorded }
    else raise ArgumentError, "unknown delivery stage"
    end
  end
end

raise unless ShutdownDeliveryDecision.classify(stage: :before_send, response_received: false)[:type] == :retry_same_event_id
raise unless ShutdownDeliveryDecision.classify(stage: :after_send, response_received: false)[:type] == :unknown
puts "SHUTDOWN_EFFECT_BOUNDARY_OK"` },
  ],
  "Backup, restore e incidentes": [
    { lang: "ruby", purpose: "Restore permanece fechado para entrega até manifest, schema e reconciliação aprovados.", code: `RestoreGate = Data.define(:manifest_valid, :checksum_valid, :schema_compatible,
  :keys_available, :inventory_complete, :reconciliation_complete)

module RestoreReadiness
  module_function
  def release?(gate)
    gate.members.all? { |field| gate.public_send(field) == true }
  end
end

pending = RestoreGate.new(manifest_valid: true, checksum_valid: true, schema_compatible: true,
  keys_available: true, inventory_complete: true, reconciliation_complete: false)
complete = RestoreGate.new(**pending.to_h.merge(reconciliation_complete: true))
raise if RestoreReadiness.release?(pending)
raise unless RestoreReadiness.release?(complete)
puts "RESTORE_DELIVERY_GATE_OK"` },
    { lang: "ruby", purpose: "Reconciliação preserva event ID e bloqueia resend para Applied ou Unknown.", code: `module RestoredEventAction
  module_function
  def for(event_id:, provider_state:, receipt: nil)
    raise ArgumentError, "event identity required" if event_id.to_s.empty?
    case provider_state
    when :applied then { event_id:, action: :record_receipt, receipt:, delivery: :blocked }
    when :not_applied then { event_id:, action: :retry_same_identity, delivery: :allowed }
    when :unknown then { event_id:, action: :manual_review, delivery: :blocked }
    when :conflict then { event_id:, action: :escalate, delivery: :blocked }
    else raise ArgumentError, "provider state"
    end
  end
end

raise unless RestoredEventAction.for(event_id: "e-1", provider_state: :applied, receipt: "r-1")[:delivery] == :blocked
raise unless RestoredEventAction.for(event_id: "e-1", provider_state: :not_applied)[:event_id] == "e-1"
raise unless RestoredEventAction.for(event_id: "e-1", provider_state: :unknown)[:action] == :manual_review
puts "RESTORE_RECONCILIATION_OK"` },
  ],
  "Arquitetura Rails do Quíron": [
    { lang: "ruby", purpose: "Controller converte identidade e input validado em comando próprio sem aceitar tenant do body.", code: `class Api::V1::ReservationsController < ApplicationController
  def create
    input = params.require(:reservation).permit(:show_id, :quantity)
    command = ReserveSeatCommand.new(
      tenant_id: current_identity.tenant_id,
      actor_id: current_identity.actor_id,
      show_id: input.fetch(:show_id),
      quantity: Integer(input.fetch(:quantity), 10),
      idempotency_key: request.headers.fetch("Idempotency-Key"),
      event_id: SecureRandom.uuid
    ).freeze
    render_outcome ReserveSeat.new.call(command)
  end
end

raise unless Api::V1::ReservationsController < ApplicationController
puts "THIN_RESERVATION_BOUNDARY_DEFINED"` },
    { lang: "ruby", purpose: "Production graph rejeita adapters de memória antes de abrir readiness.", code: `module ProductionGraphGate
  FORBIDDEN = [InMemoryReservationRepository, InlineJobAdapter, FakeReservationProvider].freeze
  module_function
  def verify!(components)
    bad = components.select { |component| FORBIDDEN.any? { |klass| component.is_a?(klass) } }
    raise "non-production adapters: #{bad.map { _1.class.name }.join(",")}" unless bad.empty?
    raise "missing components" unless components.all?
    { verified: true, component_types: components.map { _1.class.name }.sort }.freeze
  end
end

raise unless ProductionGraphGate::FORBIDDEN.length == 3
puts "PRODUCTION_GRAPH_GATE_DEFINED"` },
  ],
  "Última vaga e replay Rails": [
    { lang: "ruby", purpose: "Serviço usa update condicional e persiste reserva e outbox na mesma transação.", code: `class ReserveLastSeat
  def call(command)
    Reservation.transaction do
      won = Show.where(id: command.show_id, tenant_id: command.tenant_id)
        .where("available >= ?", command.quantity)
        .update_all(["available = available - ?", command.quantity])
      return { type: :sold_out } unless won == 1
      reservation = Reservation.create!(tenant_id: command.tenant_id, show_id: command.show_id,
        quantity: command.quantity, idempotency_key: command.idempotency_key,
        event_id: command.event_id, fingerprint: command.fingerprint, status: :pending)
      OutboxEvent.create!(tenant_id: command.tenant_id, event_id: command.event_id,
        kind: "reservation.created", aggregate_id: reservation.id, schema_version: 1)
      { type: :created, id: reservation.id, event_id: command.event_id }
    end
  end
end

raise unless ReserveLastSeat.instance_method(:call).parameters == [[:req, :command]]
puts "ATOMIC_LAST_SEAT_DEFINED"` },
    { lang: "ruby", purpose: "Idempotency registry separa tenant e recusa fingerprint divergente sem expor o original.", code: `class IdempotencyRegistry
  def resolve(tenant_id:, key:, fingerprint:)
    intent = ReservationIntent.create_or_find_by!(tenant_id:, key:) do |row|
      row.fingerprint = fingerprint
      row.event_id = SecureRandom.uuid
      row.status = :claimed
    end
    return { type: :created, intent: } if intent.previously_new_record?
    return { type: :conflict } unless intent.fingerprint == fingerprint
    { type: :replayed, intent: }
  rescue ActiveRecord::RecordNotUnique
    retry
  end
end

raise unless IdempotencyRegistry.instance_method(:resolve).parameters.map(&:last) == %i[tenant_id key fingerprint]
puts "SCOPED_IDEMPOTENCY_REGISTRY_DEFINED"` },
  ],
  "Segurança, teste e carga Rails": [
    { lang: "ruby", purpose: "Oráculo de carga rejeita desempenho quando estado ou efeito final divergem.", code: `LoadEvidence = Data.define(:requests, :p99_ms, :rss_growth_mb, :queue_age_s,
  :initial_capacity, :accepted_quantity, :final_capacity, :reservation_count, :outbox_count, :provider_effect_count)

module LoadCorrectness
  module_function
  def valid?(evidence)
    evidence.final_capacity == evidence.initial_capacity - evidence.accepted_quantity &&
      evidence.final_capacity >= 0 &&
      evidence.reservation_count == evidence.outbox_count &&
      evidence.outbox_count == evidence.provider_effect_count &&
      evidence.rss_growth_mb < 256 && evidence.queue_age_s < 30
  end
end

sample = LoadEvidence.new(requests: 10_000, p99_ms: 240, rss_growth_mb: 40, queue_age_s: 2,
  initial_capacity: 100, accepted_quantity: 100, final_capacity: 0,
  reservation_count: 100, outbox_count: 100, provider_effect_count: 100)
raise unless LoadCorrectness.valid?(sample)
puts "LOAD_STATE_EFFECT_ORACLE_OK"` },
    { lang: "ruby", purpose: "Threat gate mantém controles obrigatórios Pending em vez de convertê-los em aprovação textual.", code: `SecurityGate = Data.define(:name, :mandatory, :status, :evidence)
gates = [
  SecurityGate.new(name: :tenant_negative, mandatory: true, status: :passed, evidence: "request:cross-tenant"),
  SecurityGate.new(name: :runtime_examples, mandatory: true, status: :pending, evidence: nil),
  SecurityGate.new(name: :tls_provider, mandatory: true, status: :pending, evidence: nil),
  SecurityGate.new(name: :secret_scan, mandatory: true, status: :passed, evidence: "artifact:sentinel")
]

publishable = gates.select(&:mandatory).all? { _1.status == :passed && !_1.evidence.to_s.empty? }
raise if publishable
raise unless gates.count { _1.status == :pending } == 2
puts "SECURITY_PENDING_GATES_PRESERVED"` },
  ],
  "Banca, deploy e restore Rails": [
    { lang: "ruby", purpose: "Agregador editorial só libera fonte quando todos os gates obrigatórios possuem evidência.", code: `EvidenceGate = Data.define(:name, :mandatory, :status, :artifact_id, :evidence_uri)

module PublicationDecision
  module_function
  def evaluate(gates)
    mandatory = gates.select(&:mandatory)
    missing = mandatory.reject do |gate|
      gate.status == :passed && !gate.artifact_id.to_s.empty? && !gate.evidence_uri.to_s.empty?
    end
    { publishable: missing.empty?, missing: missing.map(&:name) }
  end
end

gates = [EvidenceGate.new(name: :structure, mandatory: true, status: :passed,
  artifact_id: "sha256:abc", evidence_uri: "test://rails"),
  EvidenceGate.new(name: :runtime, mandatory: true, status: :pending, artifact_id: nil, evidence_uri: nil)]
decision = PublicationDecision.evaluate(gates)
raise if decision[:publishable]
raise unless decision[:missing] == [:runtime]
puts "RAILS_PUBLICATION_BLOCKED_HONESTLY"` },
    { lang: "ruby", purpose: "Restore gate preserva identidade e bloqueia delivery até reconciliação completa.", code: `class RailsRestoreRelease
  REQUIRED = %i[manifest checksum schema grants keys inventory reconciliation].freeze
  def initialize(evidence) = @evidence = evidence
  def release!
    missing = REQUIRED.reject { |key| @evidence[key] == :passed }
    raise "restore gates pending: #{missing.join(",")}" unless missing.empty?
    { delivery: :enabled, released_at: Time.current, artifact_id: @evidence.fetch(:artifact_id) }
  end
end

evidence = RailsRestoreRelease::REQUIRED.to_h { [_1, :passed] }.merge(artifact_id: "sha256:abc")
release = RailsRestoreRelease.new(evidence).release!
raise unless release[:delivery] == :enabled && release[:artifact_id] == "sha256:abc"
puts "RESTORE_RELEASE_GATE_OK"` },
  ],
};
