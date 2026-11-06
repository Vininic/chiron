export type RubyExample = { lang: "ruby"; code: string; purpose: string };

/** Dois exemplos por seção redigida; drafts até execução num Ruby real. */
export const RUBY_EXAMPLES: Record<string, [RubyExample, RubyExample]> = {
  "Versão, execução e warnings": [
    { lang: "ruby", purpose: "Entry point registra identidade do runtime e recusa versão abaixo do baseline.", code: `required = Gem::Version.new("3.3")
actual = Gem::Version.new(RUBY_VERSION)
abort("Ruby 3.3+ required") if actual < required
puts({ engine: RUBY_ENGINE, version: RUBY_VERSION, platform: RUBY_PLATFORM }.inspect)` },
    { lang: "ruby", purpose: "Literal congelado e cópia mutável tornam a intenção de ownership observável.", code: `# frozen_string_literal: true

IDENTITY = "chiron/ruby"
raise "constant must be frozen" unless IDENTITY.frozen?
buffer = IDENTITY.dup
buffer << "/draft"
raise "source changed" unless IDENTITY == "chiron/ruby"
puts "FROZEN_OWNERSHIP_OK"` },
  ],
  "Números, símbolos e strings": [
    { lang: "ruby", purpose: "Parsing estrito rejeita prefixo e aplica faixa de domínio antes do uso.", code: `def quantity(raw)
  return nil unless raw.is_a?(String) && raw.bytesize <= 4
  value = Integer(raw, 10, exception: false)
  value if value&.between?(1, 1_000)
end

raise unless quantity("41") == 41
raise unless quantity("3x").nil? && quantity("0").nil?
puts "STRICT_INTEGER_OK"` },
    { lang: "ruby", purpose: "BigDecimal nasce de texto e mantém cálculo monetário fora de Float.", code: `require "bigdecimal"

unit = BigDecimal("0.10")
total = unit * 3
raise unless total == BigDecimal("0.30")
raise if total == BigDecimal(0.1, 10) * 3
puts "DECIMAL_MONEY_OK"` },
  ],
  "Nil, truthiness e navegação": [
    { lang: "ruby", purpose: "fetch distingue chave ausente de false e valida zero sem depender de truthiness.", code: `def enabled(config)
  value = config.fetch("enabled")
  raise ArgumentError unless value == true || value == false
  value
end

raise unless enabled({ "enabled" => false }) == false
begin
  enabled({})
  raise "missing accepted"
rescue KeyError
end
puts "PRESENCE_DISTINGUISHED_OK"` },
    { lang: "ruby", purpose: "Outcome explícito preserva Unknown com eventId em vez de retornar nil.", code: `Created = Data.define(:id)
Unknown = Data.define(:event_id)

def classify(sent:, response:, event_id:)
  sent && !response ? Unknown.new(event_id:) : Created.new("res-41")
end

outcome = classify(sent: true, response: false, event_id: "evt-41")
raise unless outcome in Unknown[event_id: "evt-41"]
puts "UNKNOWN_IS_NOT_NIL_OK"` },
  ],
  "Controle, pattern matching e estados": [
    { lang: "ruby", purpose: "Pattern matching trata variantes conhecidas e falha fechado para status futuro.", code: `Created = Data.define(:id)
Conflict = Data.define(:key)

def external_code(outcome)
  case outcome
  in Created[id:]
    "created:#{id}"
  in Conflict[key:]
    "conflict:#{key}"
  else
    raise ArgumentError, "unknown outcome"
  end
end

raise unless external_code(Created.new("r1")) == "created:r1"
puts "CLOSED_PATTERN_OK"` },
    { lang: "ruby", purpose: "Ensure libera recurso sem retornar e sem mascarar exception original.", code: `class Resource
  attr_reader :closed
  def close = @closed = true
end

resource = Resource.new
begin
  raise "commit failed"
ensure
  resource.close
end
rescue RuntimeError => error
  raise unless error.message == "commit failed" && resource.closed
  puts "ENSURE_PRESERVES_ERROR_OK"
end` },
  ],
  "Métodos, argumentos e keywords": [
    { lang: "ruby", purpose: "Keywords obrigatórias e allowlist impedem que opções extras atravessem a fronteira.", code: `def reserve(tenant:, show_id:, quantity:)
  raise ArgumentError unless tenant.is_a?(String) && !tenant.empty?
  raise ArgumentError unless quantity.between?(1, 100)
  [tenant.freeze, show_id.freeze, quantity]
end

raise unless reserve(tenant: "a", show_id: "s1", quantity: 1) == ["a", "s1", 1]
begin
  reserve(tenant: "a", show_id: "s1", quantity: 1, admin: true)
  raise "extra accepted"
rescue ArgumentError
end
puts "KEYWORD_BOUNDARY_OK"` },
    { lang: "ruby", purpose: "Sentinel privado distingue argumento ausente de nil explicitamente permitido.", code: `MISSING = Object.new.freeze

def optional_note(note: MISSING)
  return :missing if note.equal?(MISSING)
  return :explicit_null if note.nil?
  [:value, String(note)]
end

raise unless optional_note == :missing
raise unless optional_note(note: nil) == :explicit_null
raise unless optional_note(note: "ok") == [:value, "ok"]
puts "KEYWORD_SENTINEL_OK"` },
  ],
  "Classes, initialize e invariantes": [
    { lang: "ruby", purpose: "Value object valida antes de congelar e não expõe writer de estado.", code: `class Quantity
  attr_reader :value
  def initialize(value)
    raise ArgumentError unless value.is_a?(Integer) && value.between?(1, 100)
    @value = value
    freeze
  end
end

quantity = Quantity.new(41)
raise unless quantity.value == 41 && !quantity.respond_to?(:value=)
begin
  Quantity.new(0)
  raise "invalid constructed"
rescue ArgumentError
end
puts "CLASS_INVARIANT_OK"` },
    { lang: "ruby", purpose: "Objeto copia e congela ID para que mutação do argumento não altere sua identidade.", code: `class ReservationId
  attr_reader :value
  def initialize(value)
    @value = String(value).dup.freeze
    freeze
  end
  def eql?(other) = other.instance_of?(self.class) && value.eql?(other.value)
  alias == eql?
  def hash = [self.class, value].hash
end

source = +"res-41"
id = ReservationId.new(source)
source.replace("changed")
raise unless id.value == "res-41" && { id => :found }[ReservationId.new("res-41")] == :found
puts "IMMUTABLE_ID_OK"` },
  ],
  "Herança, modules e composição": [
    { lang: "ruby", purpose: "Decorator preserva exatamente uma chamada e o outcome do port injetado.", code: `class Repository
  attr_reader :calls
  def initialize = @calls = 0
  def save(event_id) = (@calls += 1; [:created, event_id])
end

class TracedRepository
  def initialize(inner) = @inner = inner
  def save(event_id)
    result = @inner.save(event_id)
    result
  end
end

inner = Repository.new
raise unless TracedRepository.new(inner).save("evt-41") == [:created, "evt-41"]
raise unless inner.calls == 1
puts "COMPOSED_DECORATOR_OK"` },
    { lang: "ruby", purpose: "Registro allowlisted substitui send de método vindo diretamente da entrada.", code: `OPERATIONS = {
  "status" => -> { :healthy },
  "reserve" => -> { :accepted }
}.freeze

def dispatch(name)
  operation = OPERATIONS.fetch(name) { raise ArgumentError, "unknown operation" }
  operation.call
end

raise unless dispatch("reserve") == :accepted
begin
  dispatch("instance_eval")
  raise "unsafe dispatch"
rescue ArgumentError
end
puts "ALLOWLISTED_DISPATCH_OK"` },
  ],
  "Igualdade, hash e identidade": [
    { lang: "ruby", purpose: "Composite key inclui tenant e implementa leis de igualdade exigidas por Hash.", code: `Key = Data.define(:tenant, :id) do
  def initialize(tenant:, id:)
    super(tenant: tenant.dup.freeze, id: id.dup.freeze)
    freeze
  end
end

a = Key.new(tenant: "alpha", id: "r1")
same = Key.new(tenant: "alpha", id: "r1")
other = Key.new(tenant: "beta", id: "r1")
store = { a => :alpha }
raise unless a.eql?(same) && a.hash == same.hash && store[same] == :alpha
raise if a == other
puts "TENANT_KEY_EQUALITY_OK"` },
    { lang: "ruby", purpose: "Fingerprint canônico ordena campos e distingue payload semanticamente divergente.", code: `require "digest"
require "json"

def fingerprint(fields)
  canonical = fields.sort.to_h
  Digest::SHA256.hexdigest(JSON.generate(canonical))
end

first = fingerprint({ "quantity" => 1, "show" => "s1" })
reordered = fingerprint({ "show" => "s1", "quantity" => 1 })
different = fingerprint({ "show" => "s1", "quantity" => 2 })
raise unless first == reordered && first != different
puts "CANONICAL_FINGERPRINT_OK"` },
  ],
  "Array, Hash e Set": [
    { lang: "ruby", purpose: "Default proc cria coleção independente por tenant e realmente insere a key.", code: `events = Hash.new { |hash, tenant| hash[tenant] = [] }
events["alpha"] << "evt-a"
events["beta"] << "evt-b"

raise unless events == { "alpha" => ["evt-a"], "beta" => ["evt-b"] }
raise if events["alpha"].equal?(events["beta"])
puts "INDEPENDENT_HASH_DEFAULT_OK"` },
    { lang: "ruby", purpose: "Snapshot deep-enough para value strings não muda quando a coleção viva é alterada.", code: `live = { "tenant" => +"alpha", "events" => [+"one"] }
snapshot = live.transform_values do |value|
  value.is_a?(Array) ? value.map { |item| item.dup.freeze }.freeze : value.dup.freeze
end.freeze

live["tenant"].replace("beta")
live["events"][0].replace("changed")
raise unless snapshot == { "tenant" => "alpha", "events" => ["one"] }
puts "OWNED_COLLECTION_SNAPSHOT_OK"` },
  ],
  "Enumerable e lazy": [
    { lang: "ruby", purpose: "Lazy pipeline possui limite de saída e não executa além do necessário.", code: `visited = 0
result = (1..Float::INFINITY).lazy
  .map { |value| visited += 1; value * 2 }
  .select(&:even?)
  .take(3)
  .force

raise unless result == [2, 4, 6]
raise unless visited == 3
puts "BOUNDED_LAZY_DEMAND_OK"` },
    { lang: "ruby", purpose: "Fold inicia com identidade explícita e mantém empty result definido.", code: `def total_quantities(values)
  values.reduce(0) do |sum, value|
    raise ArgumentError unless value.is_a?(Integer) && value >= 0
    sum + value
  end
end

raise unless total_quantities([]) == 0
raise unless total_quantities([20, 21]) == 41
puts "EXPLICIT_FOLD_IDENTITY_OK"` },
  ],
  "Encoding, Unicode e regex": [
    { lang: "ruby", purpose: "Boundary valida UTF-8 e bytesize antes de aceitar a string.", code: `def valid_name?(bytes)
  return false if bytes.bytesize > 32
  text = bytes.dup.force_encoding(Encoding::UTF_8)
  text.valid_encoding? && !text.empty?
end

raise unless valid_name?("Ágora".b)
raise if valid_name?("\xFF".b)
raise if valid_name?(("a" * 33).b)
puts "UTF8_BOUNDARY_OK"` },
    { lang: "ruby", purpose: "Anchors absolutos rejeitam newline que anchors por linha aceitariam.", code: `TOKEN = /\A[a-z0-9_-]{1,16}\z/

def token?(input) = TOKEN.match?(input)

raise unless token?("safe-41")
raise if token?("safe\nadmin")
raise if token?("")
puts "ABSOLUTE_REGEX_ANCHORS_OK"` },
  ],
  "Serialização e schemas": [
    { lang: "ruby", purpose: "Mapper distingue missing, tipo e faixa antes de construir comando.", code: `def decode(payload)
  quantity = payload.fetch("quantity")
  show = payload.fetch("show")
  raise ArgumentError unless quantity.is_a?(Integer) && quantity.between?(1, 100)
  raise ArgumentError unless show.is_a?(String) && !show.empty?
  { quantity:, show: show.dup.freeze }.freeze
end

raise unless decode({ "quantity" => 1, "show" => "s1" })[:quantity] == 1
begin
  decode({ "show" => "s1" })
  raise "missing accepted"
rescue KeyError
end
puts "SCHEMA_MAPPING_OK"` },
    { lang: "ruby", purpose: "Canonical JSON ordena keys antes do digest e diferencia payload divergente.", code: `require "digest"
require "json"

def canonical(value)
  value.is_a?(Hash) ? value.sort.to_h.transform_values { |item| canonical(item) } : value
end
def fingerprint(value) = Digest::SHA256.hexdigest(JSON.generate(canonical(value)))

first = fingerprint({ "b" => 2, "a" => 1 })
same = fingerprint({ "a" => 1, "b" => 2 })
different = fingerprint({ "a" => 1, "b" => 3 })
raise unless first == same && first != different
puts "CANONICAL_JSON_OK"` },
  ],
  "Exceptions, ensure e retry": [
    { lang: "ruby", purpose: "Ensure fecha recurso sem substituir a exception original.", code: `Resource = Struct.new(:closed) do
  def close = self.closed = true
end

resource = Resource.new(false)
begin
  begin
    raise "commit failed"
  ensure
    resource.close
  end
rescue RuntimeError => error
  raise unless error.message == "commit failed" && resource.closed
end
puts "ENSURE_CLEANUP_OK"` },
    { lang: "ruby", purpose: "Retry bounded conserva a mesma identidade em todas as tentativas.", code: `attempts = 0
event_id = "evt-41"
seen = []

begin
  attempts += 1
  seen << event_id
  raise IOError, "temporary" if attempts < 3
rescue IOError
  retry if attempts < 3
  raise
end

raise unless attempts == 3 && seen.uniq == ["evt-41"]
puts "BOUNDED_STABLE_RETRY_OK"` },
  ],
  "Resultados explícitos e nil": [
    { lang: "ruby", purpose: "Variantes imutáveis distinguem ausência, conflito e estado remoto desconhecido.", code: `Created = Data.define(:id)
NotFound = Data.define
Unknown = Data.define(:event_id)

def code(result)
  case result
  in Created[id:] then "created:#{id}"
  in NotFound then "not_found"
  in Unknown[event_id:] then "unknown:#{event_id}"
  else raise ArgumentError, "unknown result"
  end
end

raise unless code(Unknown.new("evt-41")) == "unknown:evt-41"
puts "EXPLICIT_RESULT_OK"` },
    { lang: "ruby", purpose: "Composição por case preserva a etapa da falha sem safe-navigation.", code: `Success = Data.define(:value)
Failure = Data.define(:stage, :code)

def persist(result)
  case result
  in Success[value:]
    value == :valid ? Success.new(:stored) : Failure.new(:validation, :invalid)
  in Failure
    result
  end
end

failure = persist(Failure.new(:lookup, :unavailable))
raise unless failure == Failure.new(:lookup, :unavailable)
puts "RESULT_CONTEXT_PRESERVED_OK"` },
  ],
  "Blocks, Proc e closures": [
    { lang: "ruby", purpose: "Resource wrapper chama o bloco uma vez e sempre fecha o owner.", code: `Resource = Struct.new(:closed) do
  def close = self.closed = true
end

def with_resource
  resource = Resource.new(false)
  result = yield resource
  [result, resource]
ensure
  resource&.close
end

calls = 0
result, resource = with_resource { calls += 1; :done }
raise unless calls == 1 && result == :done && resource.closed
puts "BLOCK_RESOURCE_SCOPE_OK"` },
    { lang: "ruby", purpose: "Callback atrasado captura snapshot owned em vez do hash mutável do request.", code: `def delayed_job(request)
  event_id = String(request.fetch(:event_id)).dup.freeze
  tenant = String(request.fetch(:tenant)).dup.freeze
  -> { [event_id, tenant] }
end

request = { event_id: +"evt-41", tenant: +"alpha" }
job = delayed_job(request)
request[:tenant].replace("beta")
raise unless job.call == ["evt-41", "alpha"]
puts "CLOSURE_SNAPSHOT_OK"` },
  ],
  "Metaprogramação com limites": [
    { lang: "ruby", purpose: "Registry explícito recusa method names herdados e desconhecidos.", code: `OPERATIONS = {
  "reserve" => ->(id) { [:reserved, id] },
  "status" => ->(_id) { :healthy }
}.freeze

def dispatch(name, id)
  OPERATIONS.fetch(name) { raise ArgumentError, "unknown operation" }.call(id)
end

raise unless dispatch("reserve", "r1") == [:reserved, "r1"]
begin
  dispatch("object_id", "r1")
  raise "inherited method reached"
rescue ArgumentError
end
puts "METAPROGRAMMING_ALLOWLIST_OK"` },
    { lang: "ruby", purpose: "method_missing estreito mantém respond_to_missing coerente e delega desconhecidos a super.", code: `class Fields
  VALUES = { "name" => "Chiron" }.freeze
  def method_missing(name, *)
    match = /\Afield_([a-z]+)\z/.match(name.to_s)
    return super unless match && VALUES.key?(match[1])
    VALUES.fetch(match[1])
  end
  def respond_to_missing?(name, include_private = false)
    /\Afield_([a-z]+)\z/.match(name.to_s)&.then { |m| VALUES.key?(m[1]) } || super
  end
end

fields = Fields.new
raise unless fields.respond_to?(:field_name) && fields.field_name == "Chiron"
raise if fields.respond_to?(:field_secret)
puts "METHOD_MISSING_CONTRACT_OK"` },
  ],
  "Threads, Mutex e ConditionVariable": [
    { lang: "ruby", purpose: "Mutex protege check e decremento da última vaga como uma única operação local.", code: `capacity = 1
mutex = Mutex.new
results = 2.times.map do
  Thread.new do
    mutex.synchronize do
      next false if capacity.zero?
      capacity -= 1
      true
    end
  end
end.map(&:value)

raise unless results.count(true) == 1 && capacity.zero?
puts "LOCAL_COMPOUND_LOCK_OK"` },
    { lang: "ruby", purpose: "ConditionVariable sempre reavalia fila ou shutdown sob o mesmo mutex.", code: `mutex = Mutex.new
condition = ConditionVariable.new
queue = []
stopping = false
consumed = nil

worker = Thread.new do
  mutex.synchronize do
    condition.wait(mutex) while queue.empty? && !stopping
    consumed = queue.shift unless queue.empty?
  end
end
mutex.synchronize { queue << 41; condition.signal }
worker.join
raise unless consumed == 41
puts "CONDITION_PREDICATE_OK"` },
  ],
  "Queue, pools e backpressure": [
    { lang: "ruby", purpose: "SizedQueue non-blocking rejeita admissão acima do limite.", code: `queue = SizedQueue.new(2)
queue.push(:first, true)
queue.push(:second, true)
rejected = false
begin
  queue.push(:third, true)
rescue ThreadError
  rejected = true
end

raise unless rejected && queue.size == 2
puts "BOUNDED_QUEUE_ADMISSION_OK"` },
    { lang: "ruby", purpose: "Um sentinel privado por worker permite drain e join de todo o pool.", code: `stop = Object.new.freeze
queue = Queue.new
processed = Queue.new
workers = 2.times.map do
  Thread.new do
    loop do
      item = queue.pop
      break if item.equal?(stop)
      processed << item
    end
  end
end
[1, 2, 3].each { |item| queue << item }
workers.size.times { queue << stop }
workers.each(&:join)
raise unless 3.times.map { processed.pop }.sort == [1, 2, 3]
puts "POOL_SHUTDOWN_OK"` },
  ],
  "Fibers, scheduler e async I/O": [
    { lang: "ruby", purpose: "Fiber cooperativo suspende e retoma mantendo um payload owned.", code: `payload = +"evt-41"
fiber = Fiber.new do
  owned = payload.dup.freeze
  Fiber.yield :waiting
  owned
end

raise unless fiber.resume == :waiting
payload.replace("changed")
raise unless fiber.resume == "evt-41"
raise if fiber.alive?
puts "FIBER_OWNS_PAYLOAD_OK"` },
    { lang: "ruby", purpose: "Budget monotônico é recalculado antes de cada etapa assíncrona.", code: `class Budget
  def initialize(total, clock)
    @deadline = clock.call + total
    @clock = clock
  end
  def remaining = [@deadline - @clock.call, 0].max
end

now = 10.0
budget = Budget.new(5.0, -> { now })
now = 13.5
raise unless budget.remaining == 1.5
now = 20.0
raise unless budget.remaining.zero?
puts "ASYNC_BUDGET_OK"` },
  ],
  "Ractors e isolamento": [
    { lang: "ruby", purpose: "Mensagem profundamente congelada pode ser verificada como shareable antes do envio.", code: `message = {
  type: :reserve,
  event_id: "evt-41".freeze,
  quantity: 1
}.freeze

raise unless Ractor.shareable?(message)
raise unless message[:event_id] == "evt-41"
puts "RACTOR_SHAREABLE_MESSAGE_OK"` },
    { lang: "ruby", purpose: "Ractor retorna resultado por mensagem e o supervisor observa a conclusão.", code: `worker = Ractor.new do
  message = Ractor.receive
  case message
  in [:double, Integer => value]
    value * 2
  else
    raise ArgumentError, "unknown message"
  end
end

worker.send([:double, 21])
raise unless worker.take == 42
puts "RACTOR_RESULT_OBSERVED_OK"` },
  ],
  "Filesystem e escrita recuperável": [
    { lang: "ruby", purpose: "Validador aceita somente path relativo sem componente de subida antes de acessar disco.", code: `require "pathname"

def safe_relative_path?(raw)
  path = Pathname.new(raw)
  return false if path.absolute? || path.each_filename.none?
  path.each_filename.none? { |part| part == ".." }
end

raise unless safe_relative_path?("tenant/snapshot.json")
raise if safe_relative_path?("../secret") || safe_relative_path?("/absolute")
puts "SAFE_RELATIVE_PATH_OK"` },
    { lang: "ruby", purpose: "Envelope local valida versão, tamanho e checksum antes de publicar payload.", code: `require "digest"

def envelope(payload)
  { version: 1, length: payload.bytesize, checksum: Digest::SHA256.hexdigest(payload), payload: }
end
def valid?(record)
  record[:version] == 1 && record[:length] == record[:payload].bytesize &&
    record[:checksum] == Digest::SHA256.hexdigest(record[:payload])
end

record = envelope("state-41")
raise unless valid?(record)
record[:payload] = "corrupt"
raise if valid?(record)
puts "FILE_ENVELOPE_OK"` },
  ],
  "HTTP, TLS e idempotência": [
    { lang: "ruby", purpose: "Estado Unknown conserva a mesma key quando request enviado perde response.", code: `Event = Data.define(:id, :state)

def classify(event_id:, sent:, response:)
  state = sent && !response ? :unknown : :confirmed
  Event.new(event_id, state)
end

first = classify(event_id: "evt-41", sent: true, response: false)
retry_identity = first.id
raise unless first.state == :unknown && retry_identity == "evt-41"
puts "HTTP_UNKNOWN_IDENTITY_OK"` },
    { lang: "ruby", purpose: "Backoff exponencial respeita Retry-After e teto global sem sleeps no teste.", code: `def delay(attempt:, retry_after:, cap: 30)
  exponential = 2**[attempt, 5].min
  [exponential, retry_after, cap].min
end

raise unless delay(attempt: 10, retry_after: 999) == 30
raise unless delay(attempt: 2, retry_after: 3) == 3
raise unless delay(attempt: 0, retry_after: 9) == 1
puts "BOUNDED_HTTP_BACKOFF_OK"` },
  ],
  "Gems, Bundler e supply chain": [
    { lang: "ruby", purpose: "Runtime manifest registra versão e plataforma efetivamente carregadas sem alegar lock suficiente.", code: `manifest = {
  ruby_engine: RUBY_ENGINE,
  ruby_version: RUBY_VERSION,
  platform: RUBY_PLATFORM,
  loaded_specs: Gem.loaded_specs.transform_values(&:version).transform_values(&:to_s)
}

raise if manifest.values_at(:ruby_engine, :ruby_version, :platform).any?(&:empty?)
raise unless manifest[:loaded_specs].is_a?(Hash)
puts "RUNTIME_DEPENDENCY_MANIFEST_OK"` },
    { lang: "ruby", purpose: "Capability de gem é verificada explicitamente antes de liberar feature.", code: `Capability = Data.define(:name, :version, :available)

def capability(name)
  spec = Gem.loaded_specs[name]
  Capability.new(name, spec&.version&.to_s, !spec.nil?)
end

ruby_gems = capability("error_highlight")
raise unless ruby_gems.name == "error_highlight"
raise unless [true, false].include?(ruby_gems.available)
puts "DEPENDENCY_CAPABILITY_CHECKED_OK"` },
  ],
  "CLI, ENV e signals": [
    { lang: "ruby", purpose: "Parser de ENV exige booleano canônico e inteiro em faixa.", code: `def boolean!(raw)
  return true if raw == "true"
  return false if raw == "false"
  raise ArgumentError, "invalid boolean"
end
def workers!(raw)
  value = Integer(raw, 10, exception: false)
  raise ArgumentError unless value&.between?(1, 32)
  value
end

raise unless boolean!("false") == false && workers!("4") == 4
begin
  workers!("4x")
  raise "invalid accepted"
rescue ArgumentError
end
puts "STRICT_ENV_CONFIG_OK"` },
    { lang: "ruby", purpose: "Coordinator mantém trabalho complexo fora do trap por uma flag mínima.", code: `shutdown_requested = false
request_shutdown = -> { shutdown_requested = true }

# Em produção, o trap apenas chamaria request_shutdown; o coordinator normal faz o drain.
request_shutdown.call
accepting = !shutdown_requested
workers_joined = shutdown_requested

raise if accepting
raise unless workers_joined
puts "SIGNAL_COORDINATOR_MODEL_OK"` },
  ],
  "Minitest, RSpec e oráculos": [
    { lang: "ruby", purpose: "Oráculo observa estado e outbox, matando implementação que só retorna sucesso.", code: `State = Data.define(:capacity, :outbox)

def reserve(state, event_id)
  return [:sold_out, state] if state.capacity.zero?
  [:created, State.new(state.capacity - 1, state.outbox + [event_id])]
end

result, state = reserve(State.new(1, []), "evt-41")
raise unless result == :created
raise unless state.capacity.zero? && state.outbox == ["evt-41"]
puts "COMPLETE_TEST_ORACLE_OK"` },
    { lang: "ruby", purpose: "Fake apply-then-drop testa estado Unknown sem se apresentar como provider real.", code: `class FakeProvider
  attr_reader :effects
  def initialize = @effects = {}
  def send(event_id)
    @effects[event_id] ||= :applied
    raise IOError, "response dropped"
  end
end

provider = FakeProvider.new
state = begin
  provider.send("evt-41")
  :sent
rescue IOError
  :unknown
end
raise unless state == :unknown && provider.effects.size == 1
puts "FAKE_BOUNDARY_EXPLICIT_OK"` },
  ],
  "Property, mutation e fuzz": [
    { lang: "ruby", purpose: "Property determinística cobre round-trip e trailing input numa faixa inteira.", code: `def parse_integer(text)
  Integer(text, 10, exception: false)
end

(-1_000..1_000).each do |value|
  raise unless parse_integer(value.to_s) == value
end
raise unless parse_integer("41x").nil?
raise unless parse_integer("").nil?
puts "INTEGER_PROPERTY_OK"` },
    { lang: "ruby", purpose: "Sequências geradas preservam capacidade e identidade nos replays.", code: `capacity = 3
events = {}
%w[a b a c d].each do |key|
  next if events.key?(key)
  next if capacity.zero?
  events[key] = "evt-#{key}"
  capacity -= 1
end

raise unless capacity.between?(0, 3)
raise unless events.keys == %w[a b c]
raise unless events["a"] == "evt-a"
puts "STATE_SEQUENCE_PROPERTY_OK"` },
  ],
  "Profiling e alocação": [
    { lang: "ruby", purpose: "Benchmark fixture mantém checksum observável para impedir medição de trabalho vazio.", code: `values = (1..1_000).to_a.freeze
checksum = 0
100.times do
  checksum ^= values.sum
end

raise unless values.sum == 500_500
raise unless checksum.zero?
puts "OBSERVABLE_PROFILE_FIXTURE_OK"` },
    { lang: "ruby", purpose: "Cache tenant-scoped memoriza false com sentinel de presença, não ||=.", code: `cache = {}
calls = 0
fetch = lambda do |tenant, key|
  composite = [tenant, key].freeze
  unless cache.key?(composite)
    calls += 1
    cache[composite] = false
  end
  cache.fetch(composite)
end

2.times { raise unless fetch.call("alpha", "enabled") == false }
raise unless calls == 1
raise unless fetch.call("beta", "enabled") == false && calls == 2
puts "CACHE_FALSE_AND_TENANT_OK"` },
  ],
  "Portabilidade e implementação": [
    { lang: "ruby", purpose: "Capability manifest registra engine, version e platform antes de selecionar implementação.", code: `Capability = Data.define(:engine, :version, :platform, :ractor)
capability = Capability.new(
  RUBY_ENGINE,
  RUBY_VERSION,
  RUBY_PLATFORM,
  defined?(Ractor) == "constant"
)

raise if capability.engine.empty? || capability.version.empty? || capability.platform.empty?
raise unless [true, false].include?(capability.ractor)
puts "RUNTIME_CAPABILITY_MANIFEST_OK"` },
    { lang: "ruby", purpose: "Deadline usa relógio monotônico injetado em vez de Time.now.", code: `class Deadline
  def initialize(seconds, clock)
    @clock = clock
    @expires_at = clock.call + seconds
  end
  def remaining = [@expires_at - @clock.call, 0.0].max
end

now = 100.0
deadline = Deadline.new(5.0, -> { now })
now = 103.5
raise unless deadline.remaining == 1.5
now = 110.0
raise unless deadline.remaining.zero?
puts "MONOTONIC_DEADLINE_MODEL_OK"` },
  ],
  "Value objects e aggregates": [
    { lang: "ruby", purpose: "Tipos de domínio distintos validam e congelam IDs e quantidade.", code: `TenantId = Data.define(:value)
ReservationId = Data.define(:value)
Quantity = Data.define(:value) do
  def initialize(value:)
    raise ArgumentError unless value.is_a?(Integer) && value.between?(1, 100)
    super
  end
end

tenant = TenantId.new("tenant-a".freeze)
reservation = ReservationId.new("res-1".freeze)
quantity = Quantity.new(value: 41)
raise if tenant == reservation
raise unless quantity.value == 41
puts "RUBY_DOMAIN_VALUES_OK"` },
    { lang: "ruby", purpose: "Aggregate aplica transição válida e produz evento owned sem chamar provider.", code: `Reserved = Data.define(:event_id, :quantity)
class Reservation
  attr_reader :remaining
  def initialize(remaining) = @remaining = remaining
  def reserve(event_id:, quantity:)
    return nil unless quantity.positive? && quantity <= @remaining
    event = Reserved.new(event_id.dup.freeze, quantity)
    @remaining -= quantity
    event
  end
end

aggregate = Reservation.new(1)
raise unless aggregate.reserve(event_id: "evt-41", quantity: 2).nil? && aggregate.remaining == 1
event = aggregate.reserve(event_id: "evt-41", quantity: 1)
raise unless event.event_id == "evt-41" && aggregate.remaining.zero?
puts "RUBY_AGGREGATE_OK"` },
  ],
  "SQL parametrizado e transactions": [
    { lang: "ruby", purpose: "Statement model mantém template e binds separados sem alegar execução num driver real.", code: `Statement = Data.define(:sql, :binds)

def reservation_insert(tenant, id)
  Statement.new(
    "INSERT INTO reservations(tenant_id, id) VALUES (?, ?)",
    [tenant.dup.freeze, id.dup.freeze].freeze
  )
end

statement = reservation_insert("tenant'a", "res-41")
raise if statement.sql.include?("tenant'a")
raise unless statement.binds.first == "tenant'a"
puts "RUBY_BIND_MODEL_OK"` },
    { lang: "ruby", purpose: "Transaction fake demonstra rollback em exception e commit explícito sem fingir banco real.", code: `class FakeTransaction
  attr_reader :state
  def initialize = @state = :open
  def commit = @state = :committed
  def rollback = @state = :rolled_back if @state == :open
end

transaction = FakeTransaction.new
begin
  raise "statement failed"
rescue
  transaction.rollback
end
raise unless transaction.state == :rolled_back
puts "RUBY_TRANSACTION_MODEL_OK"` },
  ],
  "Isolation e última vaga": [
    { lang: "ruby", purpose: "Mutex modela update condicional local e explicita que o gate real ainda é o banco.", code: `capacity = 1
mutex = Mutex.new
results = 2.times.map do
  Thread.new do
    mutex.synchronize do
      next false unless capacity.positive?
      capacity -= 1
      true
    end
  end
end.map(&:value)

raise unless results.count(true) == 1 && capacity.zero?
puts "LAST_SEAT_LOCAL_MODEL_OK"` },
    { lang: "ruby", purpose: "Registro tenant-scoped distingue replay igual de conflito divergente.", code: `intents = {}
apply = lambda do |tenant:, key:, fingerprint:|
  composite = [tenant, key].freeze
  unless intents.key?(composite)
    intents[composite] = fingerprint
    next :created
  end
  intents.fetch(composite) == fingerprint ? :replayed : :conflict
end

raise unless apply.call(tenant: "a", key: "k", fingerprint: "q1") == :created
raise unless apply.call(tenant: "a", key: "k", fingerprint: "q1") == :replayed
raise unless apply.call(tenant: "a", key: "k", fingerprint: "q2") == :conflict
puts "RUBY_REPLAY_CONFLICT_OK"` },
  ],
  "Outbox, jobs e replay": [
    { lang: "ruby", purpose: "Candidate state aplica domínio e outbox juntos antes do commit local modelado.", code: `State = Data.define(:capacity, :outbox)

def reserve(state, event_id)
  return [:sold_out, state] if state.capacity.zero?
  candidate = State.new(state.capacity - 1, state.outbox + [event_id.dup.freeze])
  [:created, candidate]
end

result, state = reserve(State.new(1, []), "evt-41")
raise unless result == :created && state.capacity.zero? && state.outbox == ["evt-41"]
puts "RUBY_OUTBOX_LOCAL_MODEL_OK"` },
    { lang: "ruby", purpose: "Apply-then-drop conserva eventId e reconcilia para sent sem segundo efeito.", code: `Event = Data.define(:id, :state)
effects = {}
event = Event.new("evt-41", :pending)

effects[event.id] ||= :applied
event = Event.new(event.id, :unknown)
event = Event.new(event.id, :sent) if effects[event.id] == :applied

raise unless event.state == :sent && event.id == "evt-41"
raise unless effects.size == 1
puts "RUBY_OUTBOX_RECONCILIATION_OK"` },
  ],
  "Ports, adapters e injeção": [
    { lang: "ruby", purpose: "Service recebe port obrigatório e preserva outcome sem conhecer o adapter concreto.", code: `class ReservationService
  def initialize(repository:)
    raise ArgumentError, "repository required" unless repository.respond_to?(:reserve)
    @repository = repository
  end
  def call(command) = @repository.reserve(command)
end

fake = Object.new
def fake.reserve(command) = [:created, command.fetch(:event_id)]
service = ReservationService.new(repository: fake)
raise unless service.call({ event_id: "evt-41" }) == [:created, "evt-41"]
puts "INJECTED_RUBY_PORT_OK"` },
    { lang: "ruby", purpose: "Adapter error mapping preserva Unknown após envio sem resposta.", code: `Unknown = Data.define(:event_id, :stage)
Created = Data.define(:id)

def map_delivery(event_id:, sent:, response:)
  return Unknown.new(event_id, :after_send) if sent && !response
  Created.new("res-41")
end

outcome = map_delivery(event_id: "evt-41", sent: true, response: false)
raise unless outcome == Unknown.new("evt-41", :after_send)
puts "PORT_ERROR_MAPPING_OK"` },
  ],
  "Logs, métricas e traces": [
    { lang: "ruby", purpose: "Redaction remove body e substitui authorization antes do sink.", code: `def safe_log(fields)
  fields = fields.transform_keys(&:to_sym).dup
  fields[:authorization] = "[REDACTED]" if fields.key?(:authorization)
  fields.delete(:body)
  fields.freeze
end

event = safe_log(operation: "reserve", authorization: "Bearer synthetic", body: "private")
raise unless event[:authorization] == "[REDACTED]" && !event.key?(:body)
puts "LOG_REDACTION_OK"` },
    { lang: "ruby", purpose: "Label allowlist bloqueia request, event e tenant IDs de alta cardinalidade.", code: `ALLOWED_LABELS = %i[operation outcome provider version].freeze

def valid_labels?(labels)
  labels.keys.all? { |key| ALLOWED_LABELS.include?(key) }
end

raise unless valid_labels?(operation: "reserve", outcome: "created")
raise if valid_labels?(operation: "reserve", request_id: "req-41")
raise if valid_labels?(tenant_id: "tenant-a")
puts "METRIC_CARDINALITY_OK"` },
  ],
  "Config, secrets e privilege": [
    { lang: "ruby", purpose: "Config snapshot exige booleano canônico e timeout dentro da faixa.", code: `Config = Data.define(:tls_verify, :timeout_ms)

def load_config(values)
  verify = { "true" => true, "false" => false }.fetch(values.fetch("TLS_VERIFY"))
  timeout = Integer(values.fetch("TIMEOUT_MS"), 10, exception: false)
  raise ArgumentError unless timeout&.between?(100, 30_000)
  Config.new(verify, timeout)
end

config = load_config("TLS_VERIFY" => "true", "TIMEOUT_MS" => "500")
raise unless config.tls_verify && config.timeout_ms == 500
puts "IMMUTABLE_CONFIG_SNAPSHOT_OK"` },
    { lang: "ruby", purpose: "Secret expõe uso explícito e descrição sempre redigida.", code: `class Secret
  def initialize(value) = @value = String(value).dup.freeze
  def use = yield @value
  def inspect = "#<Secret [REDACTED]>"
  alias to_s inspect
end

secret = Secret.new("synthetic-token")
header = secret.use { |value| "Bearer #{value}" }
raise unless header == "Bearer synthetic-token"
raise if secret.inspect.include?("synthetic")
puts "SECRET_VALUE_REDACTED_OK"` },
  ],
  "Health, overload e degradation": [
    { lang: "ruby", purpose: "Readiness depende de storage, schema, admission e capacidade real.", code: `Health = Data.define(:storage, :schema, :accepting, :queue, :limit)

def ready?(health)
  health.storage && health.schema && health.accepting && health.queue < health.limit
end

raise unless ready?(Health.new(true, true, true, 1, 2))
raise if ready?(Health.new(false, true, true, 0, 2))
raise if ready?(Health.new(true, true, true, 2, 2))
puts "RUBY_READINESS_MODEL_OK"` },
    { lang: "ruby", purpose: "Admissão non-blocking rejeita overload antes de aumentar a fila.", code: `queue = SizedQueue.new(2)
admit = lambda do |work|
  queue.push(work, true)
  :accepted
rescue ThreadError
  :overloaded
end

raise unless admit.call(:a) == :accepted
raise unless admit.call(:b) == :accepted
raise unless admit.call(:c) == :overloaded
raise unless queue.size == 2
puts "RUBY_OVERLOAD_BOUND_OK"` },
  ],
  "Packaging e containers": [
    { lang: "ruby", purpose: "Manifest do pacote registra runtime, plataforma e gems realmente carregadas.", code: `manifest = {
  engine: RUBY_ENGINE,
  ruby: RUBY_VERSION,
  platform: RUBY_PLATFORM,
  gems: Gem.loaded_specs.transform_values { |spec| spec.version.to_s }.sort.to_h
}.freeze

raise if manifest.values_at(:engine, :ruby, :platform).any?(&:empty?)
raise unless manifest[:gems].is_a?(Hash)
puts "PACKAGE_RUNTIME_MANIFEST_OK"` },
    { lang: "ruby", purpose: "Startup recusa configuração de produção incompatível antes de readiness.", code: `Config = Data.define(:environment, :tls_verify, :schema_compatible)

def ready_to_boot?(config)
  return false if config.environment == "production" && !config.tls_verify
  config.schema_compatible
end

raise unless ready_to_boot?(Config.new("production", true, true))
raise if ready_to_boot?(Config.new("production", false, true))
raise if ready_to_boot?(Config.new("production", true, false))
puts "PACKAGE_STARTUP_GATE_OK"` },
  ],
  "Migrations e rolling deploy": [
    { lang: "ruby", purpose: "Reader compatível aceita versões conhecidas e rejeita evento futuro.", code: `def read_event(payload)
  case payload.fetch("version")
  when 1 then { id: payload.fetch("id"), quantity: payload.fetch("quantity") }
  when 2 then { id: payload.fetch("id"), quantity: payload.fetch("quantity") }
  else raise ArgumentError, "unsupported event version"
  end
end

raise unless read_event({ "version" => 1, "id" => "e1", "quantity" => 1 })[:id] == "e1"
begin
  read_event({ "version" => 3, "id" => "e1", "quantity" => 1 })
  raise "future accepted"
rescue ArgumentError
end
puts "ROLLING_EVENT_COMPATIBILITY_OK"` },
    { lang: "ruby", purpose: "Operação captura snapshot da flag e não muda de writer no meio da unidade.", code: `Policy = Data.define(:version, :new_writer)

def execute(policy)
  captured = policy
  before = captured.version
  result = captured.new_writer ? :v2 : :v1
  raise unless before == captured.version
  result
end

raise unless execute(Policy.new(7, true)) == :v2
raise unless execute(Policy.new(8, false)) == :v1
puts "ROLLING_POLICY_SNAPSHOT_OK"` },
  ],
  "Shutdown, crash e recovery": [
    { lang: "ruby", purpose: "Coordinator fecha admissão, sinaliza e junta workers antes de encerrar dependencies.", code: `accepting = true
stop = false
exited = false
worker = Thread.new do
  Thread.pass until stop
  exited = true
end

accepting = false
stop = true
worker.join
dependencies_closed = true
raise if accepting
raise unless exited && dependencies_closed
puts "ORDERED_RUBY_SHUTDOWN_OK"` },
    { lang: "ruby", purpose: "Cancelamento após commit preserva identidade e estado Unknown para recovery.", code: `Work = Data.define(:event_id, :phase)

work = Work.new("evt-41", :before_commit)
work = Work.new(work.event_id, :committed)
work = Work.new(work.event_id, :unknown) # cancel/timeout depois do envio

raise unless work.event_id == "evt-41" && work.phase == :unknown
puts "CRASH_RECOVERY_IDENTITY_OK"` },
  ],
  "Backup, restore e incidentes": [
    { lang: "ruby", purpose: "Manifest de backup exige schema, checksum e identidades pendentes preservadas.", code: `Backup = Data.define(:schema, :checksum, :pending_ids)

def restoreable?(backup)
  backup.schema == 1 && backup.checksum.match?(/\A[0-9a-f]{64}\z/) &&
    backup.pending_ids.all? { |id| id.start_with?("evt-") }
end

backup = Backup.new(1, "a" * 64, ["evt-41"].freeze)
raise unless restoreable?(backup)
raise unless backup.pending_ids == ["evt-41"]
puts "RESTORE_MANIFEST_OK"` },
    { lang: "ruby", purpose: "Reconciliação mantém Unknown manual e só reenvia NotApplied com o mesmo ID.", code: `def reconciliation_action(observation)
  case observation
  when :applied then :mark_sent
  when :not_applied then :retry_same_id
  when :unknown then :manual_review
  else raise ArgumentError, "invalid observation"
  end
end

raise unless reconciliation_action(:applied) == :mark_sent
raise unless reconciliation_action(:not_applied) == :retry_same_id
raise unless reconciliation_action(:unknown) == :manual_review
puts "RESTORE_RECONCILIATION_OK"` },
  ],
  "Injection e deserialização": [
    { lang: "ruby", purpose: "Registry explícito substitui constantize/send oriundos de input.", code: `COMMANDS = {
  "reserve" => ->(payload) { [:reserve, payload.fetch("quantity")] },
  "status" => ->(_payload) { [:status] }
}.freeze

def dispatch(name, payload)
  COMMANDS.fetch(name) { raise ArgumentError, "unknown command" }.call(payload)
end

raise unless dispatch("reserve", { "quantity" => 1 }) == [:reserve, 1]
begin
  dispatch("Kernel", {})
  raise "unsafe command accepted"
rescue ArgumentError
end
puts "INJECTION_REGISTRY_OK"` },
    { lang: "ruby", purpose: "Mass-assignment é reduzido a command com allowlist e tenant autenticado externo.", code: `Command = Data.define(:tenant, :show, :quantity)

def build_command(identity_tenant, params)
  raise ArgumentError unless params.keys.sort == %w[quantity show]
  quantity = params.fetch("quantity")
  raise ArgumentError unless quantity.is_a?(Integer) && quantity.between?(1, 100)
  Command.new(identity_tenant, params.fetch("show"), quantity)
end

command = build_command("tenant-a", { "show" => "s1", "quantity" => 1 })
raise unless command.tenant == "tenant-a"
puts "MASS_ASSIGNMENT_BLOCKED_OK"` },
  ],
  "Autorização multi-tenant": [
    { lang: "ruby", purpose: "Repository model inclui tenant verificado em toda lookup.", code: `rows = {
  ["alpha", "r1"] => "alpha-data",
  ["beta", "r1"] => "beta-data"
}.freeze

def find_for_tenant(rows, tenant, id)
  rows[[tenant, id]]
end

raise unless find_for_tenant(rows, "alpha", "r1") == "alpha-data"
raise unless find_for_tenant(rows, "beta", "r1") == "beta-data"
raise if find_for_tenant(rows, "gamma", "r1")
puts "TENANT_SCOPED_LOOKUP_OK"` },
    { lang: "ruby", purpose: "Cache key inclui tenant, recurso e policy version para impedir vazamento cruzado.", code: `cache = {}
def cache_key(tenant:, resource:, policy_version:)
  [tenant.dup.freeze, resource.dup.freeze, policy_version].freeze
end

cache[cache_key(tenant: "alpha", resource: "r1", policy_version: 2)] = "A"
cache[cache_key(tenant: "beta", resource: "r1", policy_version: 2)] = "B"

raise unless cache.size == 2
raise unless cache[cache_key(tenant: "alpha", resource: "r1", policy_version: 2)] == "A"
puts "TENANT_SCOPED_CACHE_POLICY_OK"` },
  ],
  "DoS, regex e limites": [
    { lang: "ruby", purpose: "Boundary limita bytes e quantidade de itens antes do processamento de domínio.", code: `def bounded_payload?(raw, items)
  raw.bytesize <= 1_024 && items.is_a?(Array) && items.length <= 100
end

raise unless bounded_payload?("ok", Array.new(100, 1))
raise if bounded_payload?("x" * 1_025, [])
raise if bounded_payload?("ok", Array.new(101, 1))
puts "PAYLOAD_RESOURCE_LIMITS_OK"` },
    { lang: "ruby", purpose: "Regex fixa usa anchors absolutos e entrada curta antes do match.", code: `SAFE_KEY = /\A[a-z0-9_-]{1,32}\z/

def safe_key?(value)
  value.is_a?(String) && value.bytesize <= 32 && SAFE_KEY.match?(value)
end

raise unless safe_key?("event-41")
raise if safe_key?("safe\nadmin")
raise if safe_key?("a" * 33)
puts "REGEX_INPUT_BOUNDED_OK"` },
  ],
  "Auditoria e resposta": [
    { lang: "ruby", purpose: "Audit event exige identidade, decisão e versões sem incluir payload ou token.", code: `REQUIRED = %i[event_id actor tenant action decision policy_version artifact_id].freeze

def valid_audit?(event)
  REQUIRED.all? { |key| event.key?(key) } &&
    (event.keys & %i[token authorization body password]).empty?
end

event = { event_id: "audit-1", actor: "operator-7", tenant: "alpha", action: :pause_delivery,
          decision: :allowed, policy_version: 3, artifact_id: "build-41" }
raise unless valid_audit?(event)
puts "AUDIT_EVENT_CONTRACT_OK"` },
    { lang: "ruby", purpose: "Reconciliação de incidente conserva Unknown para revisão e repete somente NotApplied.", code: `def incident_action(observation)
  case observation
  when :applied then :mark_sent
  when :not_applied then :retry_same_event_id
  when :unknown then :preserve_for_review
  when :conflict then :escalate
  else raise ArgumentError
  end
end

raise unless incident_action(:applied) == :mark_sent
raise unless incident_action(:not_applied) == :retry_same_event_id
raise unless incident_action(:unknown) == :preserve_for_review
puts "INCIDENT_RECONCILIATION_OK"` },
  ],
  "API e domínio Ruby": [
    { lang: "ruby", purpose: "Boundary deriva tenant da identidade autenticada e converte somente campos permitidos em comando imutável.", code: `Command = Data.define(:tenant_id, :show_id, :quantity, :idempotency_key)

def command_from(identity:, body:, headers:)
  raise ArgumentError, "unauthenticated" unless identity[:tenant_id]
  quantity = Integer(body.fetch("quantity"), 10)
  raise ArgumentError, "quantity" unless quantity.between?(1, 8)
  Command.new(tenant_id: identity.fetch(:tenant_id), show_id: body.fetch("show_id"),
              quantity:, idempotency_key: headers.fetch("Idempotency-Key")).freeze
end

command = command_from(identity: { tenant_id: "alpha" },
  body: { "tenant_id" => "beta", "show_id" => "show-7", "quantity" => "2" },
  headers: { "Idempotency-Key" => "key-41" })
raise unless command.tenant_id == "alpha" && command.quantity == 2
puts "BOUNDARY_IDENTITY_OK"` },
    { lang: "ruby", purpose: "Serviço de aplicação registra reserva e outbox na mesma transação sem chamar o provedor externo.", code: `class Reserve
  def initialize(store) = @store = store
  def call(command)
    @store.transaction do |tx|
      return :sold_out unless tx.take_capacity(command[:tenant], command[:show], command[:quantity])
      event_id = "event-#{command[:key]}"
      tx.insert_reservation(command.merge(event_id:))
      tx.insert_outbox(event_id:, kind: "reservation.created", tenant: command[:tenant])
      { outcome: :created, event_id: }
    end
  end
end

raise unless Reserve.instance_method(:call).parameters == [[:req, :command]]
puts "SERVICE_OUTBOX_BOUNDARY_OK"` },
  ],
  "Última vaga e replay": [
    { lang: "ruby", purpose: "Modelo local com barreira demonstra a propriedade de um vencedor, sem fingir substituir o gate de duas sessões no banco.", code: `capacity = 1
results = Queue.new
mutex = Mutex.new
ready = Queue.new
release = Queue.new

threads = 2.times.map do
  Thread.new do
    ready << true
    release.pop
    won = mutex.synchronize { capacity.positive? ? (capacity -= 1; true) : false }
    results << (won ? :created : :sold_out)
  end
end
2.times { ready.pop }; 2.times { release << true }; threads.each(&:join)
observed = 2.times.map { results.pop }
raise unless observed.tally == { created: 1, sold_out: 1 } && capacity.zero?
puts "LOCAL_CONCURRENCY_MODEL_OK"` },
    { lang: "ruby", purpose: "Registro de idempotência separa tenant e distingue replay equivalente de conflito divergente.", code: `records = {}
reserve = lambda do |tenant:, key:, fingerprint:|
  scoped = [tenant, key]
  previous = records[scoped]
  if previous.nil?
    records[scoped] = fingerprint
    :created
  elsif previous == fingerprint
    :replayed
  else
    :conflict
  end
end

raise unless reserve.call(tenant: "alpha", key: "k1", fingerprint: "show=7&q=1") == :created
raise unless reserve.call(tenant: "alpha", key: "k1", fingerprint: "show=7&q=1") == :replayed
raise unless reserve.call(tenant: "alpha", key: "k1", fingerprint: "show=7&q=2") == :conflict
raise unless reserve.call(tenant: "beta", key: "k1", fingerprint: "show=7&q=2") == :created
puts "SCOPED_REPLAY_OK"` },
  ],
  "Segurança, testes e carga": [
    { lang: "ruby", purpose: "Admissão limita bytes, profundidade e quota do tenant antes de entregar trabalho ao serviço.", code: `LIMITS = { bytes: 256, depth: 4, per_tenant: 2 }.freeze
usage = Hash.new(0)

def depth(value)
  return 1 unless value.is_a?(Hash) || value.is_a?(Array)
  1 + value.map { |item| depth(item.is_a?(Array) ? item.last : item) }.max.to_i
end

admit = lambda do |tenant, raw, parsed|
  next :too_large if raw.bytesize > LIMITS[:bytes]
  next :too_deep if depth(parsed) > LIMITS[:depth]
  next :quota if usage[tenant] >= LIMITS[:per_tenant]
  usage[tenant] += 1
  :accepted
end
raise unless admit.call("alpha", "{}", { a: [1] }) == :accepted
raise unless admit.call("alpha", "x" * 257, {}) == :too_large
puts "BOUNDED_ADMISSION_OK"` },
    { lang: "ruby", purpose: "Oráculo completo valida capacidade, reserva, outbox e número de efeitos após replays.", code: `snapshot = {
  capacity: 0,
  reservations: [{ id: "r-1", event_id: "e-1", tenant: "alpha" }],
  outbox: [{ event_id: "e-1", status: :sent }],
  provider_effects: [{ event_id: "e-1", receipt: "p-9" }]
}

raise unless snapshot[:capacity].zero?
raise unless snapshot[:reservations].size == 1
raise unless snapshot[:outbox].map { _1[:event_id] } == ["e-1"]
raise unless snapshot[:provider_effects].count { _1[:event_id] == "e-1" } == 1
raise unless snapshot.values.flatten.none? { |value| value.to_s.include?("secret") }
puts "FULL_STATE_EFFECT_ORACLE_OK"` },
  ],
  "Banca, deploy e restore": [
    { lang: "ruby", purpose: "Matriz editorial só libera publicação quando todos os gates obrigatórios têm evidência Passed.", code: `Gate = Data.define(:name, :mandatory, :status, :evidence)
gates = [
  Gate.new(name: :structure, mandatory: true, status: :passed, evidence: "vitest:ruby"),
  Gate.new(name: :runtime, mandatory: true, status: :pending, evidence: nil),
  Gate.new(name: :restore, mandatory: true, status: :pending, evidence: nil)
]

publishable = gates.select(&:mandatory).all? { |gate| gate.status == :passed && !gate.evidence.to_s.empty? }
raise if publishable
raise unless gates.count { _1.status == :pending } == 2
puts "PUBLICATION_BLOCKED_BY_PENDING_GATES"` },
    { lang: "ruby", purpose: "Reconciliação pós-restore conserva o event ID e nunca reenvia estados Applied ou Unknown às cegas.", code: `def restored_action(event_id:, provider_state:)
  raise ArgumentError, "event id required" if event_id.to_s.empty?
  case provider_state
  when :applied then { event_id:, action: :record_receipt, delivery: :blocked }
  when :not_applied then { event_id:, action: :retry_same_id, delivery: :allowed }
  when :unknown then { event_id:, action: :manual_review, delivery: :blocked }
  else raise ArgumentError, "invalid provider state"
  end
end

raise unless restored_action(event_id: "e-41", provider_state: :applied)[:delivery] == :blocked
raise unless restored_action(event_id: "e-41", provider_state: :unknown)[:action] == :manual_review
raise unless restored_action(event_id: "e-41", provider_state: :not_applied)[:event_id] == "e-41"
puts "RESTORE_RECONCILIATION_OK"` },
  ],
};
