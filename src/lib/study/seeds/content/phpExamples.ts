export type PhpExample = { lang: "php"; code: string; purpose: string };
export const PHP_EXAMPLES: Record<string, [PhpExample, PhpExample]> = {
  "Versão, SAPI e configuração": [
    { lang: "php", purpose: "Boot registra capacidades sem secrets e falha se extensões obrigatórias faltarem.", code: `<?php declare(strict_types=1);
$required = ['json', 'openssl', 'pdo'];
$missing = array_values(array_filter($required, fn(string $ext): bool => !extension_loaded($ext)));
if ($missing !== []) { throw new RuntimeException('Missing extensions: '.implode(',', $missing)); }
$identity = ['php' => PHP_VERSION, 'sapi' => PHP_SAPI, 'int_size' => PHP_INT_SIZE,
  'extensions' => array_values(array_intersect($required, get_loaded_extensions()))];
if (PHP_INT_SIZE < 8) { throw new RuntimeException('64-bit runtime required'); }
echo json_encode($identity, JSON_THROW_ON_ERROR), PHP_EOL;` },
    { lang: "php", purpose: "Config parser distingue ausência, vazio e inteiro inválido antes de criar pools.", code: `<?php declare(strict_types=1);
function positiveEnv(array $env, string $key): int {
    if (!array_key_exists($key, $env)) { throw new InvalidArgumentException("missing $key"); }
    $raw = $env[$key];
    if (!is_string($raw) || !preg_match('/\\A[1-9][0-9]*\\z/D', $raw)) { throw new InvalidArgumentException("invalid $key"); }
    $value = filter_var($raw, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($value === false) { throw new InvalidArgumentException("out of range $key"); }
    return $value;
}
assert(positiveEnv(['DB_POOL' => '12'], 'DB_POOL') === 12);
echo "STRICT_CONFIG_OK\n";` },
  ],
  "Tipos escalares e strict_types": [
    { lang: "php", purpose: "Parser estrito recusa prefixos e aplica faixa de quantity.", code: `<?php declare(strict_types=1);
function quantity(mixed $raw): ?int {
    if (!is_string($raw) || !preg_match('/\\A[0-9]+\\z/D', $raw)) { return null; }
    $value = filter_var($raw, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1, 'max_range' => 8]]);
    return $value === false ? null : $value;
}
assert(quantity('3') === 3);
assert(quantity('3x') === null && quantity('0') === null && quantity('9') === null);
echo "STRICT_QUANTITY_OK\n";` },
    { lang: "php", purpose: "Boolean parser usa vocabulário fechado e distingue null, false e missing.", code: `<?php declare(strict_types=1);
function strictBoolean(mixed $raw): ?bool {
    return match ($raw) { true, 'true', 1, '1' => true, false, 'false', 0, '0' => false, default => null };
}
$input = ['enabled' => 'false', 'nullable' => null];
assert(array_key_exists('enabled', $input) && strictBoolean($input['enabled']) === false);
assert(array_key_exists('nullable', $input) && $input['nullable'] === null);
assert(!array_key_exists('missing', $input));
assert(strictBoolean('yes') === null);
echo "STRICT_BOOLEAN_OK\n";` },
  ],
  "Arrays, strings e Unicode": [
    { lang: "php", purpose: "Shape validator diferencia lista de mapa e limita itens antes do processamento.", code: `<?php declare(strict_types=1);
function reservationItems(mixed $value): array {
    if (!is_array($value) || !array_is_list($value) || count($value) > 100) { throw new InvalidArgumentException('items'); }
    foreach ($value as $item) {
        if (!is_array($item) || array_is_list($item) || array_keys($item) !== ['show_id', 'quantity']) {
            throw new InvalidArgumentException('item shape');
        }
    }
    return $value;
}
$items = reservationItems([['show_id' => 's-1', 'quantity' => 1]]);
assert(count($items) === 1);
echo "ARRAY_SHAPE_OK\n";` },
    { lang: "php", purpose: "Unicode boundary valida UTF-8, normaliza quando disponível e conserva limite em bytes e caracteres.", code: `<?php declare(strict_types=1);
function displayName(string $raw): string {
    if (strlen($raw) > 256 || !mb_check_encoding($raw, 'UTF-8')) { throw new InvalidArgumentException('encoding'); }
    $normalized = class_exists(Normalizer::class) ? Normalizer::normalize($raw, Normalizer::FORM_C) : $raw;
    if ($normalized === false || mb_strlen($normalized, 'UTF-8') > 80) { throw new InvalidArgumentException('length'); }
    return $normalized;
}
$name = displayName("Jose\u{0301}");
assert(mb_check_encoding($name, 'UTF-8'));
echo "UNICODE_BOUNDARY_OK\n";` },
  ],
  "Controle, match e funções": [
    { lang: "php", purpose: "Match fechado converte outcomes conhecidos e lança para variante futura.", code: `<?php declare(strict_types=1);
enum ReserveOutcome { case Created; case Replayed; case Conflict; case SoldOut; case Unknown; }
function httpStatus(ReserveOutcome $outcome): int {
    return match ($outcome) {
        ReserveOutcome::Created => 201,
        ReserveOutcome::Replayed => 200,
        ReserveOutcome::Conflict, ReserveOutcome::SoldOut => 409,
        ReserveOutcome::Unknown => 202,
    };
}
assert(httpStatus(ReserveOutcome::Created) === 201);
assert(httpStatus(ReserveOutcome::Unknown) === 202);
echo "EXHAUSTIVE_MATCH_OK\n";` },
    { lang: "php", purpose: "Closure atrasada captura comando imutável, não request mutável por referência.", code: `<?php declare(strict_types=1);
final readonly class ReserveCommand {
    public function __construct(public string $tenantId, public string $showId, public int $quantity) {}
}
$request = ['tenant' => 'alpha', 'show' => 'show-7', 'quantity' => 2];
$command = new ReserveCommand($request['tenant'], $request['show'], $request['quantity']);
$job = static fn(): array => [$command->tenantId, $command->showId, $command->quantity];
$request['tenant'] = 'beta'; $request['quantity'] = 8;
assert($job() === ['alpha', 'show-7', 2]);
echo "OWNED_CLOSURE_OK\n";` },
  ],
  "Classes, readonly e invariantes": [
    { lang: "php", purpose: "Entidade nasce válida e só expõe transições de domínio fechadas.", code: `<?php declare(strict_types=1);
enum ReservationStatus: string { case Pending = 'pending'; case Confirmed = 'confirmed'; case Cancelled = 'cancelled'; }
final class Reservation {
    private ReservationStatus $status;
    public function __construct(public readonly string $tenantId, public readonly string $eventId, public readonly int $quantity) {
        if ($tenantId === '' || $eventId === '' || $quantity < 1 || $quantity > 8) { throw new InvalidArgumentException('reservation'); }
        $this->status = ReservationStatus::Pending;
    }
    public function confirm(): void {
        if ($this->status !== ReservationStatus::Pending) { throw new DomainException('invalid transition'); }
        $this->status = ReservationStatus::Confirmed;
    }
    public function status(): ReservationStatus { return $this->status; }
}
$reservation = new Reservation('alpha', 'event-41', 2); $reservation->confirm();
assert($reservation->status() === ReservationStatus::Confirmed);
echo "ENTITY_INVARIANT_OK\n";` },
    { lang: "php", purpose: "Readonly com value immutable impede reatribuição e mutation indireta de tempo.", code: `<?php declare(strict_types=1);
final readonly class ReservationReceipt {
    public DateTimeImmutable $createdAt;
    public function __construct(public string $reservationId, DateTimeInterface $createdAt) {
        if ($reservationId === '') { throw new InvalidArgumentException('id'); }
        $this->createdAt = DateTimeImmutable::createFromInterface($createdAt);
    }
}
$source = new DateTime('2026-09-16T12:00:00+00:00');
$receipt = new ReservationReceipt('reservation-41', $source);
$source->modify('+1 day');
assert($receipt->createdAt->format('Y-m-d') === '2026-09-16');
echo "READONLY_OWNERSHIP_OK\n";` },
  ],
  "Enums, value objects e igualdade": [
    { lang: "php", purpose: "Money usa minor units, currency e igualdade sem Float.", code: `<?php declare(strict_types=1);
final readonly class Money {
    public function __construct(public int $minor, public string $currency) {
        if ($minor < 0 || !preg_match('/\\A[A-Z]{3}\\z/D', $currency)) { throw new InvalidArgumentException('money'); }
    }
    public function plus(self $other): self {
        if ($this->currency !== $other->currency) { throw new DomainException('currency mismatch'); }
        return new self($this->minor + $other->minor, $this->currency);
    }
    public function equals(self $other): bool { return $this->minor === $other->minor && $this->currency === $other->currency; }
}
$total = (new Money(105, 'BRL'))->plus(new Money(95, 'BRL'));
assert($total->equals(new Money(200, 'BRL')));
echo "MONEY_VALUE_OK\n";` },
    { lang: "php", purpose: "Idempotency key e fingerprint carregam escopo e canonicalização explícitos.", code: `<?php declare(strict_types=1);
final readonly class IdempotencyIdentity {
    public string $fingerprint;
    public function __construct(public string $tenantId, public string $key, array $semanticPayload) {
        if ($tenantId === '' || !preg_match('/\\A[A-Za-z0-9._:-]{8,128}\\z/D', $key)) { throw new InvalidArgumentException('identity'); }
        ksort($semanticPayload, SORT_STRING);
        $canonical = json_encode($semanticPayload, JSON_THROW_ON_ERROR | JSON_PRESERVE_ZERO_FRACTION);
        $this->fingerprint = 'v1:'.hash('sha256', $canonical);
    }
    public function equals(self $other): bool {
        return $this->tenantId === $other->tenantId && $this->key === $other->key && hash_equals($this->fingerprint, $other->fingerprint);
    }
}
$a = new IdempotencyIdentity('alpha', 'reserve:41', ['quantity' => 1, 'show' => 's1']);
$b = new IdempotencyIdentity('alpha', 'reserve:41', ['show' => 's1', 'quantity' => 1]);
assert($a->equals($b)); echo "CANONICAL_IDENTITY_OK\n";` },
  ],
  "Interfaces, traits e composição": [
    { lang: "php", purpose: "Interfaces estreitas separam persistência e provider do serviço de aplicação.", code: `<?php declare(strict_types=1);
interface ReservationRepository {
    public function transaction(Closure $operation): mixed;
    public function reserveCapacity(string $tenantId, string $showId, int $quantity): bool;
    public function insert(Reservation $reservation): void;
    public function appendOutbox(string $tenantId, string $eventId, string $kind): void;
}
interface ReservationProvider {
    public function deliver(string $tenantId, string $eventId, array $payload): ProviderOutcome;
}
enum ProviderOutcome { case Applied; case NotApplied; case Unknown; case Retryable; case Permanent; }
assert((new ReflectionClass(ReservationRepository::class))->isInterface());
assert((new ReflectionClass(ReservationProvider::class))->getMethods()[0]->getName() === 'deliver');
echo "NARROW_PORTS_OK\n";` },
    { lang: "php", purpose: "Production graph recusa adapters fake em vez de usar fallback silencioso.", code: `<?php declare(strict_types=1);
interface ProductionComponent {}
final class PdoReservationRepository implements ProductionComponent {}
final class HttpReservationProvider implements ProductionComponent {}
final class InMemoryReservationRepository {}
function verifyProductionGraph(array $components): void {
    if ($components === []) { throw new RuntimeException('empty graph'); }
    foreach ($components as $component) {
        if (!$component instanceof ProductionComponent) { throw new RuntimeException('non-production adapter '.get_debug_type($component)); }
    }
}
verifyProductionGraph([new PdoReservationRepository(), new HttpReservationProvider()]);
try { verifyProductionGraph([new InMemoryReservationRepository()]); throw new RuntimeException('expected failure'); }
catch (RuntimeException $e) { assert(str_contains($e->getMessage(), 'non-production')); }
echo "PRODUCTION_GRAPH_OK\n";` },
  ],
  "Atributos, reflection e dinamismo": [
    { lang: "php", purpose: "Registry descobre apenas handlers anotados conhecidos e rejeita chaves duplicadas.", code: `<?php declare(strict_types=1);
#[Attribute(Attribute::TARGET_CLASS)] final readonly class Handles {
    public function __construct(public string $command) {
        if (!preg_match('/\\A[a-z][a-z0-9.]{2,63}\\z/D', $command)) { throw new InvalidArgumentException('command'); }
    }
}
interface CommandHandler { public function handle(array $command): array; }
#[Handles('reservation.create')] final class CreateReservationHandler implements CommandHandler {
    public function handle(array $command): array { return ['type' => 'accepted']; }
}
$registry = [];
foreach ([CreateReservationHandler::class] as $class) {
    $reflection = new ReflectionClass($class); $attribute = $reflection->getAttributes(Handles::class)[0]->newInstance();
    if (isset($registry[$attribute->command]) || !$reflection->implementsInterface(CommandHandler::class)) { throw new RuntimeException('registry'); }
    $registry[$attribute->command] = $class;
}
assert($registry['reservation.create'] === CreateReservationHandler::class);
echo "ATTRIBUTE_REGISTRY_OK\n";` },
    { lang: "php", purpose: "Dispatcher nunca aceita class ou method names diretamente do input.", code: `<?php declare(strict_types=1);
final readonly class Dispatcher {
    public function __construct(private array $handlers) {}
    public function dispatch(string $command, array $payload): array {
        $handler = $this->handlers[$command] ?? throw new DomainException('unknown command');
        if (!$handler instanceof CommandHandler) { throw new LogicException('invalid handler'); }
        return $handler->handle($payload);
    }
}
$dispatcher = new Dispatcher(['reservation.create' => new CreateReservationHandler()]);
assert($dispatcher->dispatch('reservation.create', [])['type'] === 'accepted');
try { $dispatcher->dispatch('phpinfo', []); throw new RuntimeException('expected denial'); }
catch (DomainException) { echo "CLOSED_DISPATCH_OK\n"; }` },
  ],
  "Exceptions, Error e handlers": [
    { lang: "php", purpose: "Transaction wrapper sempre rollbacka a conexão ativa e preserva a causa original.", code: `<?php declare(strict_types=1);
final readonly class TransactionRunner {
    public function __construct(private PDO $pdo) {}
    public function run(Closure $operation): mixed {
        $this->pdo->beginTransaction();
        try {
            $result = $operation($this->pdo);
            $this->pdo->commit();
            return $result;
        } catch (Throwable $error) {
            if ($this->pdo->inTransaction()) { $this->pdo->rollBack(); }
            throw $error;
        }
    }
}
assert((new ReflectionMethod(TransactionRunner::class, 'run'))->getReturnType() instanceof ReflectionMixedType);
echo "TRANSACTION_BOUNDARY_DEFINED\n";` },
    { lang: "php", purpose: "Classificador mantém timeout após envio como Unknown em vez de retry cego.", code: `<?php declare(strict_types=1);
enum FailureStage { case BeforeSend; case AfterSend; case Response; }
enum FailureDecision { case RetrySameIdentity; case Unknown; case Permanent; case Escalate; }
function classifyFailure(FailureStage $stage, ?int $status): FailureDecision {
    return match (true) {
        $stage === FailureStage::BeforeSend => FailureDecision::RetrySameIdentity,
        $stage === FailureStage::AfterSend && $status === null => FailureDecision::Unknown,
        $stage === FailureStage::Response && $status !== null && $status >= 400 && $status < 500 => FailureDecision::Permanent,
        default => FailureDecision::Escalate,
    };
}
assert(classifyFailure(FailureStage::AfterSend, null) === FailureDecision::Unknown);
echo "FAILURE_STAGE_OK\n";` },
  ],
  "Streams e filesystem": [
    { lang: "php", purpose: "Resolved path exige containment por diretório e rejeita nome absoluto ou traversal.", code: `<?php declare(strict_types=1);
function containedFile(string $root, string $logicalName): string {
    if ($logicalName === '' || str_contains($logicalName, "\0") || preg_match('/(^|[\\\\\/])\.\.([\\\\\/]|$)/', $logicalName)) {
        throw new InvalidArgumentException('path');
    }
    if (str_starts_with($logicalName, '/') || preg_match('/\\A[A-Za-z]:[\\\\\/]/', $logicalName)) { throw new InvalidArgumentException('absolute'); }
    $rootReal = realpath($root) ?: throw new RuntimeException('root');
    $candidate = realpath($rootReal.DIRECTORY_SEPARATOR.$logicalName) ?: throw new RuntimeException('missing');
    $prefix = rtrim($rootReal, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR;
    if (!str_starts_with($candidate.DIRECTORY_SEPARATOR, $prefix)) { throw new RuntimeException('escape'); }
    return $candidate;
}
assert(is_callable('containedFile')); echo "PATH_CONTAINMENT_DEFINED\n";` },
    { lang: "php", purpose: "Leitura limitada rejeita stream maior antes de carregar bytes ilimitados.", code: `<?php declare(strict_types=1);
function readBounded($stream, int $maximum): string {
    if (!is_resource($stream) || $maximum < 1) { throw new InvalidArgumentException('stream'); }
    $buffer = '';
    while (!feof($stream)) {
        $chunk = fread($stream, min(8192, $maximum + 1 - strlen($buffer)));
        if ($chunk === false) { throw new RuntimeException('read'); }
        $buffer .= $chunk;
        if (strlen($buffer) > $maximum) { throw new LengthException('too large'); }
    }
    return $buffer;
}
$stream = fopen('php://temp', 'w+b'); fwrite($stream, 'bounded'); rewind($stream);
assert(readBounded($stream, 16) === 'bounded'); fclose($stream);
echo "BOUNDED_STREAM_OK\n";` },
  ],
  "JSON, serialize e schemas": [
    { lang: "php", purpose: "JSON boundary limita depth, exige mapa fechado e constrói DTO tipado.", code: `<?php declare(strict_types=1);
final readonly class ReserveInput { public function __construct(public string $showId, public int $quantity) {} }
function decodeReserve(string $body): ReserveInput {
    if (strlen($body) > 16_384) { throw new LengthException('body'); }
    $data = json_decode($body, true, 8, JSON_THROW_ON_ERROR | JSON_BIGINT_AS_STRING);
    if (!is_array($data) || array_is_list($data) || array_keys($data) !== ['show_id', 'quantity']) { throw new InvalidArgumentException('shape'); }
    if (!is_string($data['show_id']) || !is_int($data['quantity']) || $data['quantity'] < 1 || $data['quantity'] > 8) {
        throw new InvalidArgumentException('values');
    }
    return new ReserveInput($data['show_id'], $data['quantity']);
}
$input = decodeReserve('{"show_id":"show-7","quantity":2}');
assert($input->quantity === 2); echo "JSON_SCHEMA_BOUNDARY_OK\n";` },
    { lang: "php", purpose: "Presenter allowlisted impede propriedade nova ou secret de vazar no JSON.", code: `<?php declare(strict_types=1);
final readonly class ReservationView implements JsonSerializable {
    public function __construct(private string $id, private string $showId, private int $quantity,
        private ReservationStatus $status, private DateTimeImmutable $createdAt) {}
    public function jsonSerialize(): array {
        return ['id' => $this->id, 'show_id' => $this->showId, 'quantity' => $this->quantity,
            'status' => $this->status->value, 'created_at' => $this->createdAt->format('Y-m-d\\TH:i:s.vP')];
    }
}
$view = new ReservationView('r-1', 's-1', 1, ReservationStatus::Pending, new DateTimeImmutable('2026-09-16T12:00:00Z'));
$json = json_encode($view, JSON_THROW_ON_ERROR);
assert(!str_contains($json, 'password') && !str_contains($json, 'tenant'));
echo "ALLOWLISTED_JSON_OK\n";` },
  ],
  "Datas, números e locale": [
    { lang: "php", purpose: "Parser de instante exige formato e timezone explícitos com round-trip.", code: `<?php declare(strict_types=1);
function parseInstant(string $raw): DateTimeImmutable {
    $format = '!Y-m-d\\TH:i:sP';
    $value = DateTimeImmutable::createFromFormat($format, $raw, new DateTimeZone('UTC'));
    $errors = DateTimeImmutable::getLastErrors();
    if ($value === false || ($errors !== false && ($errors['warning_count'] > 0 || $errors['error_count'] > 0)) ||
        $value->format('Y-m-d\\TH:i:sP') !== $raw) { throw new InvalidArgumentException('instant'); }
    return $value->setTimezone(new DateTimeZone('UTC'));
}
$instant = parseInstant('2026-09-16T12:30:00+00:00');
assert($instant->format('c') === '2026-09-16T12:30:00+00:00');
echo "STRICT_INSTANT_OK\n";` },
    { lang: "php", purpose: "Minor units evitam Float e retornam quociente/remainder de rateio auditável.", code: `<?php declare(strict_types=1);
final readonly class MinorMoney {
    public function __construct(public int $minor, public string $currency) {
        if ($minor < 0 || !preg_match('/\\A[A-Z]{3}\\z/D', $currency)) { throw new InvalidArgumentException('money'); }
    }
    public function allocate(int $parts): array {
        if ($parts < 1) { throw new InvalidArgumentException('parts'); }
        $base = intdiv($this->minor, $parts); $remainder = $this->minor % $parts; $result = [];
        for ($i = 0; $i < $parts; $i++) { $result[] = new self($base + ($i < $remainder ? 1 : 0), $this->currency); }
        return $result;
    }
}
$shares = (new MinorMoney(100, 'BRL'))->allocate(3);
assert(array_sum(array_map(fn(MinorMoney $m): int => $m->minor, $shares)) === 100);
echo "EXACT_ALLOCATION_OK\n";` },
  ],
  "Request, headers e body": [
    { lang: "php", purpose: "Body reader limita bytes reais antes do JSON e constrói command com tenant autenticado.", code: `<?php declare(strict_types=1);
final readonly class ReserveHttpCommand {
    public function __construct(public string $tenantId, public string $showId, public int $quantity, public string $key) {}
}
function commandFromHttp($stream, array $headers, array $identity, int $maxBytes = 16384): ReserveHttpCommand {
    $body = '';
    while (!feof($stream)) {
        $chunk = fread($stream, min(4096, $maxBytes + 1 - strlen($body)));
        if ($chunk === false) { throw new RuntimeException('body read'); }
        $body .= $chunk;
        if (strlen($body) > $maxBytes) { throw new LengthException('payload too large'); }
    }
    $data = json_decode($body, true, 8, JSON_THROW_ON_ERROR);
    $quantity = quantity($data['quantity'] ?? null) ?? throw new InvalidArgumentException('quantity');
    return new ReserveHttpCommand($identity['tenant_id'], (string)$data['show_id'], $quantity, $headers['Idempotency-Key']);
}
$stream = fopen('php://temp', 'w+b'); fwrite($stream, '{"tenant_id":"beta","show_id":"s-1","quantity":"2"}'); rewind($stream);
$command = commandFromHttp($stream, ['Idempotency-Key' => 'reserve:41'], ['tenant_id' => 'alpha']);
assert($command->tenantId === 'alpha' && $command->quantity === 2); echo "HTTP_COMMAND_OWNERSHIP_OK\n";` },
    { lang: "php", purpose: "Trusted proxy policy ignora forwarded headers fora da rede configurada.", code: `<?php declare(strict_types=1);
function externalOrigin(array $server, array $trustedProxies, string $publicHost): string {
    $remote = $server['REMOTE_ADDR'] ?? '';
    $trusted = in_array($remote, $trustedProxies, true);
    $proto = $trusted ? strtolower((string)($server['HTTP_X_FORWARDED_PROTO'] ?? 'http')) :
        (($server['HTTPS'] ?? '') === 'on' ? 'https' : 'http');
    if ($proto !== 'https') { throw new RuntimeException('HTTPS required'); }
    if (!preg_match('/\\A[a-z0-9.-]+(?::[0-9]+)?\\z/D', $publicHost)) { throw new RuntimeException('host'); }
    return 'https://'.$publicHost;
}
$origin = externalOrigin(['REMOTE_ADDR' => '10.0.0.7', 'HTTP_X_FORWARDED_PROTO' => 'https'], ['10.0.0.7'], 'app.example');
assert($origin === 'https://app.example'); echo "TRUSTED_PROXY_ORIGIN_OK\n";` },
  ],
  "Response, cookies e sessão": [
    { lang: "php", purpose: "Mapper fechado produz status e payload distintos para replay, conflito e Unknown.", code: `<?php declare(strict_types=1);
enum ReservationOutcome { case Created; case Replayed; case Conflict; case SoldOut; case Unknown; }
function reservationResponse(ReservationOutcome $outcome, string $id): array {
    return match ($outcome) {
        ReservationOutcome::Created => [201, ['Location' => '/reservations/'.$id], ['id' => $id]],
        ReservationOutcome::Replayed => [200, ['Idempotent-Replay' => 'true'], ['id' => $id]],
        ReservationOutcome::Conflict => [409, [], ['code' => 'idempotency_conflict']],
        ReservationOutcome::SoldOut => [409, [], ['code' => 'sold_out']],
        ReservationOutcome::Unknown => [202, ['Location' => '/operations/'.$id], ['code' => 'pending', 'event_id' => $id]],
    };
}
assert(reservationResponse(ReservationOutcome::Unknown, 'e-1')[0] === 202);
echo "CLOSED_HTTP_RESPONSE_OK\n";` },
    { lang: "php", purpose: "Login regenera sessão e guarda somente identidade mínima e versão de autorização.", code: `<?php declare(strict_types=1);
function establishAuthenticatedSession(array $user): void {
    if (($user['active'] ?? false) !== true) { throw new DomainException('inactive'); }
    if (session_status() !== PHP_SESSION_ACTIVE) { throw new RuntimeException('session not active'); }
    if (!session_regenerate_id(true)) { throw new RuntimeException('session rotation failed'); }
    $_SESSION = [
        'user_id' => (string)$user['id'],
        'auth_version' => (int)$user['auth_version'],
        'authenticated_at' => time(),
    ];
}
$method = new ReflectionFunction('establishAuthenticatedSession');
assert($method->getNumberOfRequiredParameters() === 1);
echo "SESSION_ROTATION_BOUNDARY_DEFINED\n";` },
  ],
  "Routing, middleware e PSR": [
    { lang: "php", purpose: "Middleware copia identidade autenticada para command context e sempre limpa request scope.", code: `<?php declare(strict_types=1);
interface RequestHandler { public function handle(ServerRequest $request): Response; }
final readonly class Identity { public function __construct(public string $actorId, public string $tenantId) {} }
final class IdentityMiddleware {
    public function __construct(private Authenticator $authenticator, private RequestScope $scope) {}
    public function process(ServerRequest $request, RequestHandler $handler): Response {
        $identity = $this->authenticator->authenticate($request) ?? throw new Unauthorized();
        $next = $request->withAttribute('chiron.identity', $identity);
        $this->scope->setIdentity($identity);
        try { return $handler->handle($next); }
        finally { $this->scope->reset(); }
    }
}
assert((new ReflectionMethod(IdentityMiddleware::class, 'process'))->getNumberOfParameters() === 2);
echo "REQUEST_SCOPE_MIDDLEWARE_DEFINED\n";` },
    { lang: "php", purpose: "Router usa tabela fechada e nunca transforma path em class ou method callable.", code: `<?php declare(strict_types=1);
final readonly class Route { public function __construct(public string $method, public string $pattern, public string $handler) {} }
$routes = [
    new Route('POST', '/v1/reservations', 'reservation.create'),
    new Route('GET', '/v1/reservations/{id}', 'reservation.show'),
    new Route('GET', '/v1/operations/{id}', 'operation.show'),
];
function routeHandler(array $routes, string $method, string $path): string {
    foreach ($routes as $route) {
        $regex = '#^'.preg_replace('/\\{id\\}/', '[A-Za-z0-9_-]{1,128}', $route->pattern).'$#D';
        if ($route->method === $method && preg_match($regex, $path) === 1) { return $route->handler; }
    }
    throw new DomainException('route not found');
}
assert(routeHandler($routes, 'GET', '/v1/operations/e-1') === 'operation.show');
echo "CLOSED_ROUTE_TABLE_OK\n";` },
  ],
  "Templates, escaping e CSRF": [
    { lang: "php", purpose: "Helper escapa texto e atributos em UTF-8 sem marcar input como HTML confiável.", code: `<?php declare(strict_types=1);
function escapeHtml(string $value): string {
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5, 'UTF-8', false);
}
function statusBadge(string $status, string $label): string {
    $classes = ['pending' => 'status--pending', 'confirmed' => 'status--confirmed', 'cancelled' => 'status--cancelled'];
    $class = $classes[$status] ?? 'status--unknown';
    return '<span class="status '.escapeHtml($class).'">'.escapeHtml($label).'</span>';
}
$html = statusBadge('confirmed', '<img src=x onerror=alert(1)>');
assert(!str_contains($html, '<img') && str_contains($html, '&lt;img'));
echo "CONTEXTUAL_HTML_ESCAPE_OK\n";` },
    { lang: "php", purpose: "CSRF token é ligado à sessão e purpose, limitado e comparado em tempo constante.", code: `<?php declare(strict_types=1);
function issueCsrf(string $sessionSecret, string $purpose): string {
    $nonce = random_bytes(24);
    $mac = hash_hmac('sha256', $purpose."\0".$nonce, $sessionSecret, true);
    return rtrim(strtr(base64_encode($nonce.$mac), '+/', '-_'), '=');
}
function verifyCsrf(string $token, string $sessionSecret, string $purpose): bool {
    if (strlen($token) > 128) { return false; }
    $raw = base64_decode(strtr($token, '-_', '+/'), true);
    if ($raw === false || strlen($raw) !== 56) { return false; }
    $nonce = substr($raw, 0, 24); $mac = substr($raw, 24);
    return hash_equals(hash_hmac('sha256', $purpose."\0".$nonce, $sessionSecret, true), $mac);
}
$secret = random_bytes(32); $token = issueCsrf($secret, 'reservation.create');
assert(verifyCsrf($token, $secret, 'reservation.create'));
assert(!verifyCsrf($token, $secret, 'account.delete'));
echo "PURPOSE_BOUND_CSRF_OK\n";` },
  ],
  "PDO, binds e SQL seguro": [
    { lang: "php", purpose: "Repositório compõe somente estruturas permitidas e vincula valores e escopo do tenant.", code: `<?php declare(strict_types=1);
final class ReservationSearch {
    public function __construct(private PDO $db) {}
    public function find(string $tenantId, string $query, string $sort): array {
        $orders = ['created' => 'created_at DESC, id DESC', 'status' => 'status ASC, id ASC'];
        if (!isset($orders[$sort])) { throw new InvalidArgumentException('unsupported sort'); }
        $sql = 'SELECT id,status,created_at FROM reservations '
             . 'WHERE tenant_id = :tenant AND customer_name LIKE :query ESCAPE \'!\' '
             . 'ORDER BY '.$orders[$sort].' LIMIT 50';
        $escaped = strtr($query, ['!' => '!!', '%' => '!%', '_' => '!_']);
        $statement = $this->db->prepare($sql);
        $statement->bindValue(':tenant', $tenantId, PDO::PARAM_STR);
        $statement->bindValue(':query', '%'.$escaped.'%', PDO::PARAM_STR);
        $statement->execute();
        return $statement->fetchAll(PDO::FETCH_ASSOC);
    }
}
assert((new ReflectionMethod(ReservationSearch::class, 'find'))->getNumberOfParameters() === 3);
echo "SCOPED_BOUND_QUERY_DEFINED\n";` },
    { lang: "php", purpose: "Lista dinâmica cria um placeholder por ID e mapper rejeita linha parcial ou status desconhecido.", code: `<?php declare(strict_types=1);
enum ReservationStatus: string { case Pending = 'pending'; case Confirmed = 'confirmed'; case Cancelled = 'cancelled'; }
function loadReservations(PDO $db, string $tenantId, array $ids): array {
    if ($ids === [] || count($ids) > 100) { throw new InvalidArgumentException('ids'); }
    foreach ($ids as $id) { if (!is_string($id) || !preg_match('/\\A[a-z0-9-]{1,64}\\z/D', $id)) throw new InvalidArgumentException('id'); }
    $marks = implode(',', array_fill(0, count($ids), '?'));
    $statement = $db->prepare("SELECT id,tenant_id,status FROM reservations WHERE tenant_id=? AND id IN ($marks)");
    $statement->execute([$tenantId, ...$ids]);
    return array_map(static function(array $row) use ($tenantId): array {
        if (array_keys($row) !== ['id', 'tenant_id', 'status'] || $row['tenant_id'] !== $tenantId) throw new UnexpectedValueException('invalid row');
        return ['id' => (string)$row['id'], 'status' => ReservationStatus::from((string)$row['status'])];
    }, $statement->fetchAll(PDO::FETCH_ASSOC));
}
assert((new ReflectionFunction('loadReservations'))->getNumberOfParameters() === 3);
echo "BOUNDED_LIST_AND_STRICT_MAPPER_DEFINED\n";` },
  ],
  "Transactions e isolation": [
    { lang: "php", purpose: "Executor delimita uma transação local, desfaz falhas e nunca inclui a chamada remota.", code: `<?php declare(strict_types=1);
function transactional(PDO $db, callable $operation): mixed {
    if ($db->inTransaction()) { throw new LogicException('nested transaction is not supported'); }
    $db->beginTransaction();
    try {
        $result = $operation($db);
        if (!$db->commit()) { throw new RuntimeException('commit failed'); }
        return $result;
    } catch (Throwable $error) {
        if ($db->inTransaction()) { $db->rollBack(); }
        throw $error;
    }
}
final readonly class ReservationCommand {
    public function __construct(public string $commandId, public string $tenantId, public string $showId, public int $quantity) {}
}
$method = new ReflectionFunction('transactional');
assert($method->getNumberOfRequiredParameters() === 2);
echo "LOCAL_TRANSACTION_BOUNDARY_DEFINED\n";` },
    { lang: "php", purpose: "Reserva a última vaga por atualização condicional e grava outbox na mesma transação.", code: `<?php declare(strict_types=1);
function reserveCapacity(PDO $db, string $tenant, string $show, string $reservation, int $quantity): void {
    if ($quantity < 1) { throw new InvalidArgumentException('quantity'); }
    $update = $db->prepare('UPDATE shows SET available=available-:q WHERE tenant_id=:t AND id=:s AND available>=:q');
    $update->execute(['q' => $quantity, 't' => $tenant, 's' => $show]);
    if ($update->rowCount() !== 1) { throw new DomainException('sold out or absent'); }
    $insert = $db->prepare('INSERT INTO reservations(id,tenant_id,show_id,quantity,status) VALUES(:id,:t,:s,:q,\'pending\')');
    $insert->execute(['id' => $reservation, 't' => $tenant, 's' => $show, 'q' => $quantity]);
    $outbox = $db->prepare('INSERT INTO outbox(id,tenant_id,event_type,aggregate_id) VALUES(:id,:t,\'reservation.created\',:r)');
    $outbox->execute(['id' => 'evt-'.$reservation, 't' => $tenant, 'r' => $reservation]);
}
assert((new ReflectionFunction('reserveCapacity'))->getNumberOfRequiredParameters() === 5);
echo "ATOMIC_CAPACITY_AND_OUTBOX_DEFINED\n";` },
  ],
  "Modelagem, migrations e constraints": [
    { lang: "php", purpose: "Migração explícita materializa unicidade, integridade entre tenants e limites de capacidade.", code: `<?php declare(strict_types=1);
$migration = <<<'SQL'
CREATE TABLE shows (
  tenant_id VARCHAR(64) NOT NULL, id VARCHAR(64) NOT NULL,
  available INTEGER NOT NULL CONSTRAINT ck_shows_available CHECK (available >= 0),
  PRIMARY KEY (tenant_id, id)
);
CREATE TABLE reservations (
  tenant_id VARCHAR(64) NOT NULL, id VARCHAR(64) NOT NULL, show_id VARCHAR(64) NOT NULL,
  idempotency_key VARCHAR(128) NOT NULL, fingerprint CHAR(64) NOT NULL,
  quantity INTEGER NOT NULL CONSTRAINT ck_reservations_quantity CHECK (quantity > 0),
  status VARCHAR(16) NOT NULL CONSTRAINT ck_reservations_status CHECK (status IN ('pending','confirmed','cancelled')),
  PRIMARY KEY (tenant_id, id),
  CONSTRAINT uq_reservations_idempotency UNIQUE (tenant_id, idempotency_key),
  CONSTRAINT fk_reservations_show FOREIGN KEY (tenant_id, show_id) REFERENCES shows(tenant_id, id)
);
SQL;
assert(str_contains($migration, 'UNIQUE (tenant_id, idempotency_key)'));
assert(str_contains($migration, 'FOREIGN KEY (tenant_id, show_id)'));
echo "TENANT_CONSTRAINT_MIGRATION_DEFINED\n";` },
    { lang: "php", purpose: "Tradutor reconhece apenas constraints conhecidas e não converte qualquer erro de integridade em replay.", code: `<?php declare(strict_types=1);
enum PersistenceOutcome { case IdempotencyCollision; case CapacityViolation; case UnknownFailure; }
function persistenceOutcome(PDOException $error): PersistenceOutcome {
    $sqlState = (string)($error->errorInfo[0] ?? $error->getCode());
    $driverMessage = (string)($error->errorInfo[2] ?? '');
    if ($sqlState === '23505' && str_contains($driverMessage, 'uq_reservations_idempotency')) {
        return PersistenceOutcome::IdempotencyCollision;
    }
    if ($sqlState === '23514' && str_contains($driverMessage, 'ck_shows_available')) {
        return PersistenceOutcome::CapacityViolation;
    }
    return PersistenceOutcome::UnknownFailure;
}
$reflection = new ReflectionFunction('persistenceOutcome');
assert((string)$reflection->getReturnType() === PersistenceOutcome::class);
echo "NAMED_CONSTRAINT_MAPPING_DEFINED\n";` },
  ],
  "Repositories, mapping e ORM": [
    { lang: "php", purpose: "Contrato de repositório exige contexto do tenant e implementação não oferece busca global por ID.", code: `<?php declare(strict_types=1);
interface ReservationRepository {
    public function find(string $tenantId, string $reservationId): ?ReservationRecord;
    public function save(string $tenantId, ReservationRecord $reservation): void;
}
final readonly class ReservationRecord {
    public function __construct(public string $id, public string $tenantId, public string $status, public int $quantity) {
        if ($id === '' || $tenantId === '' || $quantity < 1 || !in_array($status, ['pending','confirmed','cancelled'], true)) {
            throw new InvalidArgumentException('invalid reservation');
        }
    }
}
final class PdoReservationRepository implements ReservationRepository {
    public function __construct(private PDO $db) {}
    public function find(string $tenantId, string $reservationId): ?ReservationRecord {
        $q=$this->db->prepare('SELECT id,tenant_id,status,quantity FROM reservations WHERE tenant_id=:t AND id=:id');
        $q->execute(['t'=>$tenantId,'id'=>$reservationId]); $row=$q->fetch(PDO::FETCH_ASSOC);
        return $row === false ? null : mapReservation($row, $tenantId);
    }
    public function save(string $tenantId, ReservationRecord $reservation): void { if ($reservation->tenantId !== $tenantId) throw new LogicException('tenant mismatch'); }
}
assert((new ReflectionMethod(ReservationRepository::class, 'find'))->getNumberOfParameters() === 2);
echo "TENANT_SCOPED_REPOSITORY_DEFINED\n";` },
    { lang: "php", purpose: "Mapper estrito preserva IDs, recusa colunas ou tipos corrompidos e verifica o tenant consultado.", code: `<?php declare(strict_types=1);
function mapReservation(array $row, string $expectedTenant): ReservationRecord {
    $expected = ['id', 'tenant_id', 'status', 'quantity'];
    if (array_keys($row) !== $expected) { throw new UnexpectedValueException('reservation row shape'); }
    if (!is_string($row['id']) || $row['id'] === '' || !is_string($row['tenant_id']) || $row['tenant_id'] !== $expectedTenant) {
        throw new UnexpectedValueException('reservation identity');
    }
    $quantity = filter_var($row['quantity'], FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($quantity === false || !is_string($row['status'])) { throw new UnexpectedValueException('reservation values'); }
    return new ReservationRecord($row['id'], $row['tenant_id'], $row['status'], $quantity);
}
$valid = ['id'=>'r-01','tenant_id'=>'tenant-a','status'=>'pending','quantity'=>'2'];
assert(mapReservation($valid, 'tenant-a')->quantity === 2);
try { mapReservation($valid, 'tenant-b'); assert(false); } catch (UnexpectedValueException) {}
echo "STRICT_ROW_MAPPER_OK\n";` },
  ],
  "Namespaces e Composer autoload": [
    { lang: "php", purpose: "Classe PSR-4 declara comportamento sem executar bootstrap, I/O ou conexão durante o carregamento.", code: `<?php declare(strict_types=1);
namespace Chiron\Reservation\Domain;
final readonly class ReservationId {
    private function __construct(public string $value) {}
    public static function fromString(string $raw): self {
        if (!preg_match('/\\Ares_[a-z0-9]{16}\\z/D', $raw)) { throw new \InvalidArgumentException('reservation id'); }
        return new self($raw);
    }
}
$id = ReservationId::fromString('res_0123456789abcdef');
assert($id->value === 'res_0123456789abcdef');
echo "SIDE_EFFECT_FREE_SYMBOL_OK\n";` },
    { lang: "php", purpose: "Registry fechado traduz nomes externos em factories conhecidas sem instanciar FQCN recebido.", code: `<?php declare(strict_types=1);
interface Notifier { public function channel(): string; }
final class EmailNotifier implements Notifier { public function channel(): string { return 'email'; } }
final class NullNotifier implements Notifier { public function channel(): string { return 'null'; } }
function notifierFor(string $name): Notifier {
    $factories = ['email' => static fn() => new EmailNotifier(), 'disabled' => static fn() => new NullNotifier()];
    if (!isset($factories[$name])) { throw new InvalidArgumentException('unsupported notifier'); }
    return $factories[$name]();
}
assert(notifierFor('email')->channel() === 'email');
try { notifierFor('PDO'); assert(false); } catch (InvalidArgumentException) {}
echo "CLOSED_SYMBOL_REGISTRY_OK\n";` },
  ],
  "Composer lock e supply chain": [
    { lang: "php", purpose: "Validador de boot compara capacidades reais com o contrato gravado no artefato.", code: `<?php declare(strict_types=1);
function assertRuntime(array $manifest): void {
    if (!isset($manifest['php'], $manifest['extensions']) || !is_array($manifest['extensions'])) throw new RuntimeException('invalid manifest');
    if (version_compare(PHP_VERSION, (string)$manifest['php'], '<')) throw new RuntimeException('unsupported PHP');
    $missing = array_values(array_filter($manifest['extensions'], static fn(string $ext): bool => !extension_loaded($ext)));
    if ($missing !== []) throw new RuntimeException('missing extensions: '.implode(',', $missing));
}
assertRuntime(['php' => '8.1.0', 'extensions' => ['json']]);
echo "ARTIFACT_PLATFORM_CONTRACT_OK\n";` },
    { lang: "php", purpose: "Manifesto sanitizado liga release, lock e SBOM sem transportar tokens de repositório.", code: `<?php declare(strict_types=1);
function releaseManifest(string $release, string $lockPath, string $sbomDigest): array {
    if (!preg_match('/\\A[a-f0-9]{40}\\z/D', $release)) throw new InvalidArgumentException('release');
    if (!is_file($lockPath)) throw new RuntimeException('lock missing');
    $lock = hash_file('sha256', $lockPath);
    if ($lock === false || !preg_match('/\\Asha256:[a-f0-9]{64}\\z/D', $sbomDigest)) throw new RuntimeException('manifest input');
    return ['release' => $release, 'composer_lock_sha256' => $lock, 'sbom' => $sbomDigest, 'php' => PHP_VERSION];
}
$method = new ReflectionFunction('releaseManifest');
assert($method->getNumberOfRequiredParameters() === 3);
echo "SANITIZED_RELEASE_MANIFEST_DEFINED\n";` },
  ],
  "Container e dependency injection": [
    { lang: "php", purpose: "Composition root seleciona adapters por configuração fechada e não possui fallback silencioso.", code: `<?php declare(strict_types=1);
interface ReservationStore { public function adapterName(): string; }
final class PdoReservationStore implements ReservationStore { public function __construct(private PDO $pdo) {} public function adapterName(): string { return 'pdo'; } }
final class MemoryReservationStore implements ReservationStore { public function adapterName(): string { return 'memory'; } }
function reservationStore(string $environment, PDO $pdo): ReservationStore {
    return match ($environment) {
        'production', 'staging' => new PdoReservationStore($pdo),
        'test' => new MemoryReservationStore(),
        default => throw new InvalidArgumentException('unsupported environment'),
    };
}
assert((new ReflectionFunction('reservationStore'))->getNumberOfRequiredParameters() === 2);
echo "EXPLICIT_PRODUCTION_BINDING_DEFINED\n";` },
    { lang: "php", purpose: "Scope de request é limpo em finally para impedir retenção de identidade entre trabalhos do worker.", code: `<?php declare(strict_types=1);
final class RequestScope {
    private ?string $tenantId = null;
    public function enter(string $tenantId): void { if ($this->tenantId !== null || $tenantId === '') throw new LogicException('scope state'); $this->tenantId=$tenantId; }
    public function tenantId(): string { return $this->tenantId ?? throw new LogicException('outside request'); }
    public function reset(): void { $this->tenantId=null; }
}
function withinRequest(RequestScope $scope, string $tenant, callable $work): mixed {
    $scope->enter($tenant); try { return $work($scope); } finally { $scope->reset(); }
}
$scope=new RequestScope(); assert(withinRequest($scope, 'alpha', fn($s) => $s->tenantId()) === 'alpha');
try { $scope->tenantId(); assert(false); } catch (LogicException) {}
echo "REQUEST_SCOPE_RESET_OK\n";` },
  ],
  "Bibliotecas e compatibilidade": [
    { lang: "php", purpose: "API pública evolui por capability opcional sem adicionar método à interface implementada por consumidores.", code: `<?php declare(strict_types=1);
interface Clock { public function now(): DateTimeImmutable; }
interface MonotonicClock extends Clock { public function monotonicNanoseconds(): int; }
final class FrozenClock implements Clock {
    public function __construct(private DateTimeImmutable $instant) {}
    public function now(): DateTimeImmutable { return $this->instant; }
}
function elapsedCapability(Clock $clock): ?int {
    return $clock instanceof MonotonicClock ? $clock->monotonicNanoseconds() : null;
}
$clock = new FrozenClock(new DateTimeImmutable('2026-01-01T00:00:00Z'));
assert(elapsedCapability($clock) === null && $clock->now()->format('Y') === '2026');
echo "OPTIONAL_CAPABILITY_COMPATIBLE_OK\n";` },
    { lang: "php", purpose: "Caminho depreciado delega uma vez ao substituto e conserva resultado e categoria de erro.", code: `<?php declare(strict_types=1);
final class Fingerprint {
    public static function canonical(array $command): string {
        ksort($command); return hash('sha256', json_encode($command, JSON_THROW_ON_ERROR | JSON_PRESERVE_ZERO_FRACTION));
    }
    /** @deprecated Use canonical(); removal planned for 3.0. */
    public static function fromPayload(array $payload): string {
        trigger_error('Fingerprint::fromPayload is deprecated; use canonical', E_USER_DEPRECATED);
        return self::canonical($payload);
    }
}
set_error_handler(static fn(int $level): bool => $level === E_USER_DEPRECATED);
$input=['quantity'=>2,'show'=>'s-1'];
assert(Fingerprint::fromPayload($input) === Fingerprint::canonical($input));
restore_error_handler();
echo "DEPRECATION_DELEGATES_ONCE_OK\n";` },
  ],
  "Process model, FPM e state": [
    { lang: "php", purpose: "Envelope de unidade sempre limpa contexto e rejeita reentrada no mesmo worker.", code: `<?php declare(strict_types=1);
final class WorkerContext {
    private ?string $tenant = null;
    public function enter(string $tenant): void { if ($tenant === '' || $this->tenant !== null) throw new LogicException('context already active'); $this->tenant=$tenant; }
    public function tenant(): string { return $this->tenant ?? throw new LogicException('no active context'); }
    public function leave(): void { $this->tenant=null; }
}
function handleUnit(WorkerContext $context, string $tenant, callable $handler): mixed {
    $context->enter($tenant); try { return $handler($context); } finally { $context->leave(); }
}
$context=new WorkerContext(); assert(handleUnit($context,'alpha',fn($c)=>$c->tenant())==='alpha');
assert(handleUnit($context,'beta',fn($c)=>$c->tenant())==='beta');
echo "WORKER_CONTEXT_RESET_OK\n";` },
    { lang: "php", purpose: "Cache local exige chave contextual completa e limite explícito, nunca apenas ID global.", code: `<?php declare(strict_types=1);
final class BoundedPolicyCache {
    private array $entries=[];
    public function __construct(private int $maximum=128) { if ($maximum < 1) throw new InvalidArgumentException('maximum'); }
    public function remember(string $tenant, string $actor, int $policyVersion, callable $load): bool {
        $key=hash('sha256',$tenant."\0".$actor."\0".$policyVersion);
        if (array_key_exists($key,$this->entries)) return $this->entries[$key];
        if (count($this->entries) >= $this->maximum) array_shift($this->entries);
        return $this->entries[$key]=(bool)$load();
    }
}
$cache=new BoundedPolicyCache(2);
assert($cache->remember('alpha','u-1',1,fn()=>true));
assert(!$cache->remember('beta','u-1',1,fn()=>false));
echo "CONTEXTUAL_BOUNDED_CACHE_OK\n";` },
  ],
  "Queues, retries e idempotência": [
    { lang: "php", purpose: "Envelope versionado valida identidade estável, tenant e payload antes do handler.", code: `<?php declare(strict_types=1);
final readonly class JobEnvelope {
    public function __construct(public string $id, public string $type, public int $version, public string $tenantId, public array $payload) {
        if (!preg_match('/\\Aevt_[a-f0-9]{32}\\z/D',$id) || $type !== 'reservation.dispatch' || $version !== 1 || $tenantId === '') {
            throw new InvalidArgumentException('invalid envelope');
        }
        if (strlen(json_encode($payload,JSON_THROW_ON_ERROR)) > 8192) throw new InvalidArgumentException('payload too large');
    }
}
$job=new JobEnvelope('evt_0123456789abcdef0123456789abcdef','reservation.dispatch',1,'tenant-a',['reservation_id'=>'r-1']);
assert($job->id === 'evt_0123456789abcdef0123456789abcdef');
echo "VERSIONED_JOB_ENVELOPE_OK\n";` },
    { lang: "php", purpose: "Política de retry preserva operation ID e limita somente falhas transitórias.", code: `<?php declare(strict_types=1);
enum FailureKind { case RateLimited; case Unavailable; case InvalidPayload; case Forbidden; case UnknownOutcome; }
final readonly class RetryDecision { public function __construct(public bool $retry, public ?int $delayMs) {} }
function retryDecision(FailureKind $kind, int $attempt, int $retryAfterMs=0): RetryDecision {
    if ($attempt < 1) throw new InvalidArgumentException('attempt');
    if (!in_array($kind,[FailureKind::RateLimited,FailureKind::Unavailable],true) || $attempt >= 5) return new RetryDecision(false,null);
    $base=min(30_000,250*(2 ** ($attempt-1))); $bounded=max($base,min(60_000,$retryAfterMs));
    return new RetryDecision(true,$bounded + (($attempt*137)%251));
}
assert(retryDecision(FailureKind::Unavailable,2)->retry);
assert(!retryDecision(FailureKind::InvalidPayload,1)->retry);
assert(!retryDecision(FailureKind::UnknownOutcome,1)->retry);
echo "BOUNDED_RETRY_POLICY_OK\n";` },
  ],
  "Outbox, claims e fencing": [
    { lang: "php", purpose: "Claim usa atualização condicional e retorna token monotônico para todas as transições seguintes.", code: `<?php declare(strict_types=1);
function claimOutbox(PDO $db, string $eventId, string $workerId, DateTimeImmutable $now): int {
    $lease=$now->modify('+30 seconds')->format('Y-m-d H:i:s.uP');
    $q=$db->prepare("UPDATE outbox SET owner_id=:owner, lease_until=:lease, fence=fence+1, status='claimed' WHERE id=:id AND status IN ('pending','retryable') AND (lease_until IS NULL OR lease_until<:now)");
    $q->execute(['owner'=>$workerId,'lease'=>$lease,'id'=>$eventId,'now'=>$now->format('Y-m-d H:i:s.uP')]);
    if ($q->rowCount() !== 1) throw new DomainException('claim lost');
    $read=$db->prepare('SELECT fence FROM outbox WHERE id=:id AND owner_id=:owner');
    $read->execute(['id'=>$eventId,'owner'=>$workerId]);
    $token=$read->fetchColumn(); if (!is_int($token) && !ctype_digit((string)$token)) throw new UnexpectedValueException('fence');
    return (int)$token;
}
assert((new ReflectionFunction('claimOutbox'))->getNumberOfRequiredParameters()===4);
echo "FENCED_OUTBOX_CLAIM_DEFINED\n";` },
    { lang: "php", purpose: "Conclusão aceita somente owner e fencing token atuais e preserva receipt externo.", code: `<?php declare(strict_types=1);
function completeOutbox(PDO $db,string $eventId,string $workerId,int $fence,string $receipt): void {
    if ($fence < 1 || $receipt === '') throw new InvalidArgumentException('completion');
    $q=$db->prepare("UPDATE outbox SET status='sent', receipt=:receipt, sent_at=CURRENT_TIMESTAMP, owner_id=NULL, lease_until=NULL WHERE id=:id AND owner_id=:owner AND fence=:fence AND status='claimed'");
    $q->execute(['receipt'=>$receipt,'id'=>$eventId,'owner'=>$workerId,'fence'=>$fence]);
    if ($q->rowCount() !== 1) throw new DomainException('stale outbox owner');
}
function markUnknown(PDO $db,string $eventId,string $workerId,int $fence): void {
    $q=$db->prepare("UPDATE outbox SET status='unknown' WHERE id=:id AND owner_id=:owner AND fence=:fence AND status='claimed'");
    $q->execute(['id'=>$eventId,'owner'=>$workerId,'fence'=>$fence]);
    if ($q->rowCount()!==1) throw new DomainException('stale unknown transition');
}
assert((new ReflectionFunction('completeOutbox'))->getNumberOfRequiredParameters()===5);
echo "FENCED_OUTBOX_COMPLETION_DEFINED\n";` },
  ],
  "Fibers, event loops e async": [
    { lang: "php", purpose: "Exemplo mínimo mostra suspensão cooperativa e contexto passado por valor, não em global mutável.", code: `<?php declare(strict_types=1);
final readonly class OperationContext { public function __construct(public string $tenantId, public string $operationId) { if ($tenantId===''||$operationId==='') throw new InvalidArgumentException('context'); } }
function cooperativeStep(OperationContext $context): Fiber {
    return new Fiber(function() use ($context): string {
        $signal=Fiber::suspend(['tenant'=>$context->tenantId,'operation'=>$context->operationId]);
        if ($signal !== 'resume') throw new RuntimeException('cancelled');
        return $context->tenantId.':'.$context->operationId;
    });
}
$fiber=cooperativeStep(new OperationContext('alpha','op-1'));
assert($fiber->start()===['tenant'=>'alpha','operation'=>'op-1']);
$fiber->resume('resume'); assert($fiber->getReturn()==='alpha:op-1');
echo "EXPLICIT_FIBER_CONTEXT_OK\n";` },
    { lang: "php", purpose: "Semáforo cooperativo limita fan-out e libera permit em finally, inclusive quando a tarefa falha.", code: `<?php declare(strict_types=1);
final class PermitPool {
    private int $inUse=0;
    public function __construct(private int $capacity) { if ($capacity<1) throw new InvalidArgumentException('capacity'); }
    public function run(callable $task): mixed {
        if ($this->inUse >= $this->capacity) throw new RuntimeException('backpressure');
        $this->inUse++; try { return $task(); } finally { $this->inUse--; }
    }
    public function inUse(): int { return $this->inUse; }
}
$pool=new PermitPool(1);
try { $pool->run(fn()=>throw new RuntimeException('peer failed')); } catch (RuntimeException $e) { assert($e->getMessage()==='peer failed'); }
assert($pool->inUse()===0 && $pool->run(fn()=>42)===42);
echo "BOUNDED_ASYNC_PERMITS_OK\n";` },
  ],
  "PHPUnit e unit contracts": [
    { lang: "php", purpose: "Teste unitário tabelado fixa fronteiras de quantity sem depender de framework ou infraestrutura.", code: `<?php declare(strict_types=1);
function parseQuantity(mixed $raw): int {
    if (!is_string($raw) || !preg_match('/\\A[0-9]+\\z/D',$raw)) throw new InvalidArgumentException('quantity');
    $value=filter_var($raw,FILTER_VALIDATE_INT,['options'=>['min_range'=>1,'max_range'=>8]]);
    if ($value===false) throw new InvalidArgumentException('quantity'); return $value;
}
$valid=['minimum'=>['1',1],'middle'=>['4',4],'maximum'=>['8',8]];
foreach($valid as $case=>[$input,$expected]) assert(parseQuantity($input)===$expected,$case);
foreach(['zero'=>'0','overflow'=>'9','suffix'=>'2x','wrong-type'=>2] as $case=>$input){ try{parseQuantity($input);assert(false,$case);}catch(InvalidArgumentException){} }
echo "QUANTITY_UNIT_TABLE_OK\n";` },
    { lang: "php", purpose: "Contract reutilizável verifica isolamento por tenant e colisão divergente em qualquer adapter.", code: `<?php declare(strict_types=1);
interface IntentStore { public function put(string $tenant,string $key,string $fingerprint): string; public function get(string $tenant,string $key): ?string; }
function intentStoreContract(callable $factory): void {
    $store=$factory();
    assert($store->get('alpha','k-1')===null);
    assert($store->put('alpha','k-1','fp-a')==='created');
    assert($store->put('alpha','k-1','fp-a')==='replayed');
    assert($store->put('alpha','k-1','fp-b')==='conflict');
    assert($store->get('alpha','k-1')==='fp-a');
    assert($store->get('beta','k-1')===null);
}
assert((new ReflectionFunction('intentStoreContract'))->getNumberOfRequiredParameters()===1);
echo "INTENT_STORE_CONTRACT_DEFINED\n";` },
  ],
  "Integration, HTTP e banco": [
    { lang: "php", purpose: "Harness envia request bruto pelo kernel e lê estado por conexão independente.", code: `<?php declare(strict_types=1);
interface HttpKernel { public function handle(string $method,string $path,array $headers,string $body): array; }
function reservationIntegration(HttpKernel $kernel,PDO $observer,string $tenant,string $key): void {
    $response=$kernel->handle('POST','/v1/reservations',['content-type'=>'application/json','x-tenant-id'=>$tenant,'idempotency-key'=>$key],json_encode(['show_id'=>'s-1','quantity'=>1],JSON_THROW_ON_ERROR));
    assert($response['status']===201 && str_starts_with((string)$response['headers']['content-type'],'application/json'));
    $q=$observer->prepare('SELECT r.status,COUNT(o.id) AS outbox_count FROM reservations r LEFT JOIN outbox o ON o.tenant_id=r.tenant_id AND o.aggregate_id=r.id WHERE r.tenant_id=:t GROUP BY r.status');
    $q->execute(['t'=>$tenant]); $row=$q->fetch(PDO::FETCH_ASSOC);
    assert($row!==false && $row['status']==='pending' && (int)$row['outbox_count']===1);
}
assert((new ReflectionFunction('reservationIntegration'))->getNumberOfRequiredParameters()===4);
echo "HTTP_DATABASE_INTEGRATION_DEFINED\n";` },
    { lang: "php", purpose: "Oracle concorrente exige exatamente um vencedor e confirma capacidade por terceira conexão.", code: `<?php declare(strict_types=1);
function assertLastSeat(array $outcomes,PDO $observer,string $tenant,string $show): void {
    sort($outcomes); assert($outcomes===['created','sold_out']);
    $q=$observer->prepare('SELECT available FROM shows WHERE tenant_id=:t AND id=:s');
    $q->execute(['t'=>$tenant,'s'=>$show]); assert((int)$q->fetchColumn()===0);
    $r=$observer->prepare('SELECT COUNT(*) FROM reservations WHERE tenant_id=:t AND show_id=:s');
    $r->execute(['t'=>$tenant,'s'=>$show]); assert((int)$r->fetchColumn()===1);
    $o=$observer->prepare('SELECT COUNT(*) FROM outbox WHERE tenant_id=:t AND event_type=:e');
    $o->execute(['t'=>$tenant,'e'=>'reservation.created']); assert((int)$o->fetchColumn()===1);
}
assert((new ReflectionFunction('assertLastSeat'))->getNumberOfRequiredParameters()===4);
echo "TWO_SESSION_ORACLE_DEFINED\n";` },
  ],
  "Static analysis e mutation": [
    { lang: "php", purpose: "DTO de fronteira refina array mixed em tipos e enum antes de alcançar o domínio.", code: `<?php declare(strict_types=1);
enum RequestedChannel:string { case Email='email'; case Sms='sms'; }
final readonly class CreateReservationInput {
    public function __construct(public string $showId,public int $quantity,public RequestedChannel $channel) {}
    /** @param array<string,mixed> $body */
    public static function fromArray(array $body): self {
        if(array_keys($body)!==['show_id','quantity','channel']||!is_string($body['show_id'])||$body['show_id']==='') throw new InvalidArgumentException('shape');
        if(!is_int($body['quantity'])||$body['quantity']<1||$body['quantity']>8||!is_string($body['channel'])) throw new InvalidArgumentException('values');
        return new self($body['show_id'],$body['quantity'],RequestedChannel::from($body['channel']));
    }
}
$input=CreateReservationInput::fromArray(['show_id'=>'s-1','quantity'=>2,'channel'=>'email']);
assert($input->channel===RequestedChannel::Email);
echo "REFINED_BOUNDARY_DTO_OK\n";` },
    { lang: "php", purpose: "Oráculo foi desenhado para matar mutantes de tenant, limite e fingerprint divergente.", code: `<?php declare(strict_types=1);
function reservationOracle(callable $reserve): void {
    assert($reserve('alpha','k-1',['show'=>'s-1','quantity'=>1])==='created');
    assert($reserve('alpha','k-1',['show'=>'s-1','quantity'=>1])==='replayed');
    assert($reserve('alpha','k-1',['show'=>'s-1','quantity'=>2])==='conflict');
    assert($reserve('beta','k-1',['show'=>'s-1','quantity'=>1])==='created');
    try { $reserve('alpha','k-2',['show'=>'s-1','quantity'=>0]); assert(false); } catch (InvalidArgumentException) {}
}
$criticalMutants=['remove-tenant-scope','quantity-greater-or-equal-zero','ignore-divergent-fingerprint','skip-rollback'];
assert(count($criticalMutants)===4 && (new ReflectionFunction('reservationOracle'))->getNumberOfRequiredParameters()===1);
echo "CRITICAL_MUTATION_ORACLE_DEFINED\n";` },
  ],
  "Property, fuzz e security corpus": [
    { lang: "php", purpose: "Property de fingerprint prova independência da ordem e sensibilidade a mudança sem reutilizar o oracle interno.", code: `<?php declare(strict_types=1);
function commandFingerprint(array $command): string { ksort($command); return hash('sha256',json_encode($command,JSON_THROW_ON_ERROR|JSON_PRESERVE_ZERO_FRACTION)); }
mt_srand(104729);
for($case=0;$case<500;$case++){
    $quantity=mt_rand(1,8); $show='s-'.mt_rand(1,100000);
    $a=['show_id'=>$show,'quantity'=>$quantity]; $b=['quantity'=>$quantity,'show_id'=>$show];
    assert(commandFingerprint($a)===commandFingerprint($b));
    $changed=['show_id'=>$show,'quantity'=>$quantity+1]; assert(commandFingerprint($a)!==commandFingerprint($changed));
}
echo "FINGERPRINT_PROPERTY_OK seed=104729 cases=500\n";` },
    { lang: "php", purpose: "Corpus associa payload ao sink e exige rejeição bounded em vez de apenas ausência de exception.", code: `<?php declare(strict_types=1);
$corpus=[
 ['sink'=>'sql-identifier','value'=>'created_at DESC; DROP TABLE reservations--'],
 ['sink'=>'path','value'=>'..%2f..%2f.env'],
 ['sink'=>'url','value'=>'http://169.254.169.254/latest/meta-data/'],
 ['sink'=>'html-text','value'=>'<img src=x onerror=alert(1)>'],
 ['sink'=>'json-depth','value'=>str_repeat('[',80).'0'.str_repeat(']',80)],
];
function acceptsClosedSort(string $value): bool { return array_key_exists($value,['created'=>'created_at DESC','status'=>'status ASC']); }
assert(!acceptsClosedSort($corpus[0]['value']));
$decoded=json_decode($corpus[4]['value'],true,32,JSON_INVALID_UTF8_SUBSTITUTE);
assert($decoded===null && json_last_error()===JSON_ERROR_DEPTH);
assert(count($corpus)===5);
echo "SINK_SPECIFIC_SECURITY_CORPUS_OK\n";` },
  ],
  "Authentication e autorização tenant": [
    { lang: "php", purpose: "Login verifica hash, rehash oportunista e regenera sessão sem guardar credencial.", code: `<?php declare(strict_types=1);
function authenticate(array $record,string $password,array $options=[]): string {
    $hash=$record['password_hash']??'';
    if(!is_string($hash)||!password_verify($password,$hash)) throw new DomainException('invalid credentials');
    if(($record['active']??false)!==true) throw new DomainException('invalid credentials');
    if(password_needs_rehash($hash,PASSWORD_DEFAULT,$options)) { /* persist new hash in the same trusted account scope */ }
    if(session_status()!==PHP_SESSION_ACTIVE||!session_regenerate_id(true)) throw new RuntimeException('session rotation failed');
    $_SESSION=['actor_id'=>(string)$record['id'],'auth_version'=>(int)$record['auth_version']];
    return (string)$record['id'];
}
assert((new ReflectionFunction('authenticate'))->getNumberOfRequiredParameters()===2);
echo "SESSION_AUTH_BOUNDARY_DEFINED\n";` },
    { lang: "php", purpose: "Policy exige identidade e recurso do mesmo tenant antes de autorizar transição.", code: `<?php declare(strict_types=1);
final readonly class Identity { public function __construct(public string $actorId,public string $tenantId,public array $capabilities,public int $authVersion) {} }
final readonly class ReservationView { public function __construct(public string $id,public string $tenantId,public string $ownerId,public string $status) {} }
function mayCancel(Identity $identity,ReservationView $reservation): bool {
    if($identity->tenantId!==$reservation->tenantId||$identity->authVersion<1||$reservation->status!=='pending') return false;
    return $identity->actorId===$reservation->ownerId||in_array('reservation.cancel:any',$identity->capabilities,true);
}
$actor=new Identity('u-1','alpha',['reservation.cancel:own'],1);
assert(mayCancel($actor,new ReservationView('r-1','alpha','u-1','pending')));
assert(!mayCancel($actor,new ReservationView('r-1','beta','u-1','pending')));
echo "TENANT_POLICY_NEGATIVE_OK\n";` },
  ],
  "Injection, upload e SSRF": [
    { lang: "php", purpose: "URL de saída usa HTTPS, host cadastrado, porta fechada e nenhuma credencial embutida.", code: `<?php declare(strict_types=1);
function approvedWebhook(string $raw,array $allowedHosts): array {
    if(strlen($raw)>2048) throw new InvalidArgumentException('url length');
    $url=parse_url($raw); if($url===false||($url['scheme']??null)!=='https'||isset($url['user'],$url['pass'],$url['fragment'])) throw new InvalidArgumentException('url');
    $host=strtolower(rtrim((string)($url['host']??''),'.')); $port=(int)($url['port']??443);
    if(!in_array($host,$allowedHosts,true)||$port!==443) throw new InvalidArgumentException('destination');
    return ['scheme'=>'https','host'=>$host,'port'=>443,'path'=>(string)($url['path']??'/')];
}
assert(approvedWebhook('https://hooks.example.test/v1',['hooks.example.test'])['host']==='hooks.example.test');
try{approvedWebhook('http://169.254.169.254/latest/meta-data/',['hooks.example.test']);assert(false);}catch(InvalidArgumentException){}
echo "CLOSED_EGRESS_DESTINATION_OK\n";` },
    { lang: "php", purpose: "Upload recebe limites, MIME por conteúdo, nome gerado e armazenamento fora da raiz pública.", code: `<?php declare(strict_types=1);
function storeUpload(array $file,string $storageRoot): string {
    if(($file['error']??UPLOAD_ERR_NO_FILE)!==UPLOAD_ERR_OK||!is_int($file['size']??null)||$file['size']<1||$file['size']>2_000_000) throw new InvalidArgumentException('upload');
    $tmp=$file['tmp_name']??null; if(!is_string($tmp)||!is_uploaded_file($tmp)) throw new InvalidArgumentException('source');
    $mime=(new finfo(FILEINFO_MIME_TYPE))->file($tmp); $extensions=['image/png'=>'png','image/jpeg'=>'jpg'];
    if(!is_string($mime)||!isset($extensions[$mime])) throw new InvalidArgumentException('type');
    $name=bin2hex(random_bytes(16)).'.'.$extensions[$mime]; $target=rtrim($storageRoot,DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$name;
    if(!move_uploaded_file($tmp,$target)) throw new RuntimeException('store failed'); chmod($target,0640); return $name;
}
assert((new ReflectionFunction('storeUpload'))->getNumberOfRequiredParameters()===2);
echo "BOUNDED_UPLOAD_PIPELINE_DEFINED\n";` },
  ],
  "Secrets, TLS e headers": [
    { lang: "php", purpose: "Objeto de segredo evita conversão e serialização acidentais e expõe uso por callback estreito.", code: `<?php declare(strict_types=1);
final class SecretValue {
    public function __construct(#[\SensitiveParameter] private string $value) { if($value==='') throw new InvalidArgumentException('missing secret'); }
    public function use(callable $consumer): mixed { return $consumer($this->value); }
    public function __serialize(): array { throw new LogicException('secret serialization forbidden'); }
    public function __debugInfo(): array { return ['value'=>'[REDACTED]']; }
}
$secret=new SecretValue('test-canary-not-a-production-secret');
$digest=$secret->use(static fn(#[\SensitiveParameter] string $value)=>hash('sha256',$value));
assert(strlen($digest)===64 && !str_contains(var_export($secret,true),'test-canary'));
echo "NON_SERIALIZABLE_SECRET_OK\n";` },
    { lang: "php", purpose: "Política central produz cookies e headers seguros sem refletir host ou input do request.", code: `<?php declare(strict_types=1);
function securityHeaders(string $nonce): array {
    if(!preg_match('/\\A[A-Za-z0-9_-]{32,128}\\z/D',$nonce)) throw new InvalidArgumentException('nonce');
    return ['Content-Security-Policy'=>"default-src 'none'; script-src 'nonce-$nonce'; style-src 'self'; img-src 'self'; frame-ancestors 'none'; base-uri 'none'",'X-Content-Type-Options'=>'nosniff','Referrer-Policy'=>'no-referrer','Cache-Control'=>'no-store'];
}
function sessionCookie(string $value): array { if($value===''||str_contains($value,"\r")||str_contains($value,"\n")) throw new InvalidArgumentException('cookie'); return ['value'=>$value,'secure'=>true,'httponly'=>true,'samesite'=>'Lax','path'=>'/']; }
$headers=securityHeaders(rtrim(strtr(base64_encode(random_bytes(32)),'+/','-_'),'='));
assert(str_contains($headers['Content-Security-Policy'],"frame-ancestors 'none'"));
assert(sessionCookie('opaque-session-id')['secure']===true);
echo "RESPONSE_SECURITY_POLICY_OK\n";` },
  ],
  "DoS, limits e incident response": [
    { lang: "php", purpose: "Decoder rejeita bytes e profundidade antes de criar comando ou consumir trabalho de domínio.", code: `<?php declare(strict_types=1);
function decodeBoundedJson(string $body,int $maximumBytes=65536,int $maximumDepth=32): array {
    if(strlen($body)>$maximumBytes) throw new LengthException('body too large');
    try{$decoded=json_decode($body,true,$maximumDepth,JSON_THROW_ON_ERROR|JSON_INVALID_UTF8_SUBSTITUTE);}catch(JsonException $e){throw new InvalidArgumentException('invalid JSON',0,$e);}
    if(!is_array($decoded)||array_is_list($decoded)||count($decoded)>32) throw new InvalidArgumentException('object shape');
    return $decoded;
}
assert(decodeBoundedJson('{"show_id":"s-1","quantity":1}')['quantity']===1);
try{decodeBoundedJson(str_repeat('[',40).'0'.str_repeat(']',40));assert(false);}catch(InvalidArgumentException){}
try{decodeBoundedJson(str_repeat('x',65537));assert(false);}catch(LengthException){}
echo "BOUNDED_JSON_DECODER_OK\n";` },
    { lang: "php", purpose: "Admission control limita concorrência por capacidade global e por tenant com cleanup garantido.", code: `<?php declare(strict_types=1);
final class AdmissionControl {
    private int $global=0; private array $perTenant=[];
    public function __construct(private int $globalLimit,private int $tenantLimit) {}
    public function run(string $tenant,callable $work): mixed {
        $current=$this->perTenant[$tenant]??0;
        if($this->global>=$this->globalLimit||$current>=$this->tenantLimit) throw new RuntimeException('overloaded');
        $this->global++; $this->perTenant[$tenant]=$current+1;
        try{return $work();}finally{$this->global--;if(--$this->perTenant[$tenant]===0)unset($this->perTenant[$tenant]);}
    }
}
$control=new AdmissionControl(2,1); assert($control->run('alpha',fn()=>42)===42);
try{$control->run('alpha',fn()=>throw new RuntimeException('failure'));}catch(RuntimeException){}
assert($control->run('alpha',fn()=>7)===7);
echo "ADMISSION_CLEANUP_OK\n";` },
  ],
  "OPcache, JIT e preload": [
    { lang: "php", purpose: "Manifesto de runtime compara release e configurações críticas sem publicar paths ou segredos.", code: `<?php declare(strict_types=1);
function runtimeIdentity(string $release): array {
    if(!preg_match('/\\A[a-f0-9]{40}\\z/D',$release)) throw new InvalidArgumentException('release');
    return ['release'=>$release,'php'=>PHP_VERSION,'sapi'=>PHP_SAPI,'opcache_enabled'=>(bool)ini_get('opcache.enable'),'validate_timestamps'=>(bool)ini_get('opcache.validate_timestamps'),'jit_buffer'=>(int)ini_get('opcache.jit_buffer_size')];
}
$identity=runtimeIdentity(str_repeat('a',40));
assert($identity['release']===str_repeat('a',40)&&array_keys($identity)===['release','php','sapi','opcache_enabled','validate_timestamps','jit_buffer']);
echo json_encode($identity,JSON_THROW_ON_ERROR),"\n";` },
    { lang: "php", purpose: "Arquivo candidato a preload é auditado por símbolos permitidos e ausência de bootstrap imperativo.", code: `<?php declare(strict_types=1);
function assertPreloadSource(string $source): void {
    $forbidden=['new PDO','getenv(','putenv(','curl_exec(','file_get_contents("http','beginTransaction(','session_start('];
    foreach($forbidden as $needle) if(str_contains($source,$needle)) throw new RuntimeException('preload side effect: '.$needle);
    if(!str_contains($source,'declare(strict_types=1)')) throw new RuntimeException('strict types missing');
}
$safe='<?php declare(strict_types=1); namespace Chiron; final readonly class ReleaseId { public function __construct(public string $value) {} }';
assertPreloadSource($safe);
try{assertPreloadSource('<?php declare(strict_types=1); $db=new PDO($dsn);');assert(false);}catch(RuntimeException){}
echo "PRELOAD_SIDE_EFFECT_GATE_OK\n";` },
  ],
  "FPM, pools e servidores": [
    { lang: "php", purpose: "Cálculo conservador limita children por memória e conexões disponíveis, registrando headroom.", code: `<?php declare(strict_types=1);
function safeChildren(int $hostMemoryMb,int $reservedMb,int $workerP99Mb,int $databaseConnections,int $databaseReserve): int {
    foreach(func_get_args() as $value) if(!is_int($value)||$value<0) throw new InvalidArgumentException('capacity');
    if($workerP99Mb<1||$hostMemoryMb<=$reservedMb||$databaseConnections<=$databaseReserve) throw new InvalidArgumentException('insufficient capacity');
    $byMemory=intdiv($hostMemoryMb-$reservedMb,$workerP99Mb); $byDatabase=$databaseConnections-$databaseReserve;
    return max(1,min($byMemory,$byDatabase));
}
assert(safeChildren(4096,1024,160,30,5)===19);
assert(safeChildren(4096,1024,80,12,4)===8);
echo "POOL_CAPACITY_BOUND_OK\n";` },
    { lang: "php", purpose: "Deadline interno reserva orçamento para cleanup e não excede a camada externa.", code: `<?php declare(strict_types=1);
final readonly class DeadlineBudget {
    public function __construct(public int $proxyMs,public int $applicationMs,public int $databaseMs,public int $providerMs,public int $cleanupMs) {
        if($cleanupMs<100||$applicationMs+$cleanupMs>=$proxyMs||max($databaseMs,$providerMs)>=$applicationMs) throw new InvalidArgumentException('misaligned deadlines');
    }
}
$budget=new DeadlineBudget(proxyMs:5000,applicationMs:4300,databaseMs:1200,providerMs:3000,cleanupMs:400);
assert($budget->applicationMs+$budget->cleanupMs<$budget->proxyMs);
try{new DeadlineBudget(5000,4900,1200,3000,200);assert(false);}catch(InvalidArgumentException){}
echo "LAYERED_DEADLINES_OK\n";` },
  ],
  "Logs, metrics e traces": [
    { lang: "php", purpose: "Logger constrói evento por allowlist e redige valores antes de qualquer exporter.", code: `<?php declare(strict_types=1);
function operationLog(string $event,string $operationId,string $outcome,array $context=[]): array {
    $allowed=array_intersect_key($context,array_flip(['release','attempt','route','error_class','duration_ms']));
    foreach($allowed as $key=>$value) if(is_string($value)&&preg_match('/bearer|password|cookie|token/i',$value)) $allowed[$key]='[REDACTED]';
    return ['timestamp'=>(new DateTimeImmutable('now',new DateTimeZone('UTC')))->format(DateTimeInterface::RFC3339_EXTENDED),'event'=>$event,'operation_id'=>$operationId,'outcome'=>$outcome]+$allowed;
}
$log=operationLog('reservation.create','op-1','created',['route'=>'reservation.create','token'=>'secret','attempt'=>1]);
assert(!isset($log['token'])&&$log['route']==='reservation.create'&&$log['attempt']===1);
echo "ALLOWLISTED_OPERATION_LOG_OK\n";` },
    { lang: "php", purpose: "Métrica usa somente labels de vocabulário fechado e rejeita path, tenant ou mensagem arbitrária.", code: `<?php declare(strict_types=1);
function metricLabels(string $operation,string $outcome,string $errorClass='none'): array {
    $operations=['reservation.create','reservation.cancel','outbox.dispatch']; $outcomes=['created','replayed','conflict','failed','unknown']; $errors=['none','validation','authorization','dependency','internal'];
    if(!in_array($operation,$operations,true)||!in_array($outcome,$outcomes,true)||!in_array($errorClass,$errors,true)) throw new InvalidArgumentException('unbounded metric label');
    return ['operation'=>$operation,'outcome'=>$outcome,'error_class'=>$errorClass];
}
assert(metricLabels('reservation.create','created')['error_class']==='none');
try{metricLabels('/v1/reservations/customer-123','created');assert(false);}catch(InvalidArgumentException){}
echo "BOUNDED_METRIC_LABELS_OK\n";` },
  ],
  "Profiling, carga e memória": [
    { lang: "php", purpose: "Oracle de carga combina outcomes e estado durável, impedindo aprovar throughput com perda.", code: `<?php declare(strict_types=1);
function assertLoadOracle(array $outcomes,array $state,int $initialCapacity): void {
    $created=count(array_filter($outcomes,fn($v)=>$v==='created'));
    $replayed=count(array_filter($outcomes,fn($v)=>$v==='replayed'));
    $allowed=['created','replayed','conflict','sold_out'];
    foreach($outcomes as $outcome) if(!in_array($outcome,$allowed,true)) throw new UnexpectedValueException('unknown outcome');
    assert($state['capacity']>=0&&$state['capacity']===$initialCapacity-$created);
    assert($state['reservations']===$created&&$state['outbox']===$created&&$state['duplicate_effects']===0);
    assert($replayed>=0);
}
assertLoadOracle(['created','replayed','sold_out'],['capacity'=>0,'reservations'=>1,'outbox'=>1,'duplicate_effects'=>0],1);
echo "LOAD_STATE_EFFECT_ORACLE_OK\n";` },
    { lang: "php", purpose: "Soak sampler calcula inclinação de RSS para revelar retenção além do snapshot final.", code: `<?php declare(strict_types=1);
function rssSlopeBytesPerUnit(array $samples): float {
    if(count($samples)<3) throw new InvalidArgumentException('samples');
    $n=count($samples); $sumX=$sumY=$sumXY=$sumXX=0.0;
    foreach(array_values($samples) as $x=>$y){if(!is_int($y)||$y<0)throw new InvalidArgumentException('rss');$sumX+=$x;$sumY+=$y;$sumXY+=$x*$y;$sumXX+=$x*$x;}
    $denominator=$n*$sumXX-$sumX*$sumX; if($denominator===0.0)throw new LogicException('slope');
    return ($n*$sumXY-$sumX*$sumY)/$denominator;
}
$stable=[100_000_000,100_100_000,99_950_000,100_050_000,100_000_000];
assert(abs(rssSlopeBytesPerUnit($stable))<50_000);
echo "SOAK_RSS_SLOPE_OK\n";` },
  ],
  "Build, container e provenance": [
    { lang: "php", purpose: "Manifesto liga release, lock, SBOM e imagem a digests validados antes da promoção.", code: `<?php declare(strict_types=1);
final readonly class ArtifactManifest {
    public function __construct(public string $release,public string $composerLockSha256,public string $imageDigest,public string $sbomDigest) {
        if(!preg_match('/\\A[a-f0-9]{40}\\z/D',$release)) throw new InvalidArgumentException('release');
        foreach([$composerLockSha256,$imageDigest,$sbomDigest] as $digest) if(!preg_match('/\\Asha256:[a-f0-9]{64}\\z/D',$digest)) throw new InvalidArgumentException('digest');
    }
    public function promotionKey(): string { return hash('sha256',implode("\0",[$this->release,$this->composerLockSha256,$this->imageDigest,$this->sbomDigest])); }
}
$digest='sha256:'.str_repeat('a',64); $manifest=new ArtifactManifest(str_repeat('b',40),$digest,$digest,$digest);
assert(strlen($manifest->promotionKey())===64);
echo "IMMUTABLE_ARTIFACT_MANIFEST_OK\n";` },
    { lang: "php", purpose: "Gate de artifact rejeita usuário privilegiado, paths graváveis inesperados e extensões ausentes.", code: `<?php declare(strict_types=1);
function assertArtifactRuntime(array $probe): void {
    $expected=['uid','writable_paths','extensions','release'];
    if(array_keys($probe)!==$expected||$probe['uid']===0||!is_array($probe['writable_paths'])||!is_array($probe['extensions'])) throw new RuntimeException('runtime probe');
    $allowed=['/tmp/chiron','/var/lib/chiron/uploads'];
    if(array_diff($probe['writable_paths'],$allowed)!==[]) throw new RuntimeException('unexpected writable path');
    foreach(['json','openssl','pdo'] as $extension) if(!in_array($extension,$probe['extensions'],true)) throw new RuntimeException('missing extension');
    if(!preg_match('/\\A[a-f0-9]{40}\\z/D',(string)$probe['release'])) throw new RuntimeException('release');
}
assertArtifactRuntime(['uid'=>10001,'writable_paths'=>['/tmp/chiron'],'extensions'=>['json','openssl','pdo'],'release'=>str_repeat('c',40)]);
echo "ARTIFACT_RUNTIME_GATE_OK\n";` },
  ],
  "Deploy, migrations e rollback": [
    { lang: "php", purpose: "Compatibilidade de schema explicita janela old/new e bloqueia contração prematura.", code: `<?php declare(strict_types=1);
enum SchemaPhase:string { case Expand='expand'; case DualWrite='dual_write'; case PreferNew='prefer_new'; case Contract='contract'; }
final readonly class DeploymentCompatibility {
    public function __construct(public SchemaPhase $phase,public bool $oldReads,public bool $oldWrites,public bool $newReads,public bool $newWrites) {}
    public function canRollBackCode(): bool { return $this->oldReads&&$this->oldWrites; }
    public function mayDropOldColumn(): bool { return $this->phase===SchemaPhase::Contract&&!$this->oldReads&&!$this->oldWrites&&$this->newReads&&$this->newWrites; }
}
$expand=new DeploymentCompatibility(SchemaPhase::Expand,true,true,true,true);
assert($expand->canRollBackCode()&&!$expand->mayDropOldColumn());
$contract=new DeploymentCompatibility(SchemaPhase::Contract,false,false,true,true);
assert(!$contract->canRollBackCode()&&$contract->mayDropOldColumn());
echo "EXPAND_CONTRACT_GUARD_OK\n";` },
    { lang: "php", purpose: "Canary decide promoção por erro, unknown, saturação e divergência, não somente HTTP 5xx.", code: `<?php declare(strict_types=1);
function mayPromoteCanary(array $window): bool {
    $required=['requests','error_rate','unknown_outcomes','db_pool_wait_p95_ms','queue_oldest_seconds','state_divergences'];
    if(array_keys($window)!==$required||$window['requests']<500) return false;
    return $window['error_rate']<=0.005&&$window['unknown_outcomes']===0&&$window['db_pool_wait_p95_ms']<100&&$window['queue_oldest_seconds']<30&&$window['state_divergences']===0;
}
$healthy=['requests'=>1000,'error_rate'=>0.001,'unknown_outcomes'=>0,'db_pool_wait_p95_ms'=>20,'queue_oldest_seconds'=>2,'state_divergences'=>0];
assert(mayPromoteCanary($healthy));
$healthy['state_divergences']=1; assert(!mayPromoteCanary($healthy));
echo "CANARY_STATE_GATE_OK\n";` },
  ],
  "Shutdown, workers e recovery": [
    { lang: "php", purpose: "Worker em drain recusa claims novos e termina somente trabalho dentro do orçamento restante.", code: `<?php declare(strict_types=1);
final class DrainController {
    private bool $draining=false;
    public function begin(): void { $this->draining=true; }
    public function mayClaim(): bool { return !$this->draining; }
    public function mayStart(int $estimatedMs,int $remainingGraceMs,int $cleanupMs=500): bool {
        return !$this->draining&&$estimatedMs>0&&$estimatedMs+$cleanupMs<$remainingGraceMs;
    }
}
$drain=new DrainController(); assert($drain->mayClaim()&&$drain->mayStart(1000,3000));
$drain->begin(); assert(!$drain->mayClaim()&&!$drain->mayStart(100,3000));
echo "WORKER_DRAIN_ADMISSION_OK\n";` },
    { lang: "php", purpose: "Classificador de recovery impede retry cego para commit ou efeito de resultado desconhecido.", code: `<?php declare(strict_types=1);
enum KillPoint { case BeforeBegin; case BeforeCommit; case AfterCommitNoResponse; case AfterProviderNoReceipt; case AfterReceiptBeforeAck; }
enum RecoveryAction { case RetryStableCommand; case ReadBackDatabase; case QueryProvider; case RedeliverIdempotently; }
function recoveryAction(KillPoint $point): RecoveryAction { return match($point){
    KillPoint::BeforeBegin,KillPoint::BeforeCommit=>RecoveryAction::RetryStableCommand,
    KillPoint::AfterCommitNoResponse=>RecoveryAction::ReadBackDatabase,
    KillPoint::AfterProviderNoReceipt=>RecoveryAction::QueryProvider,
    KillPoint::AfterReceiptBeforeAck=>RecoveryAction::RedeliverIdempotently,
}; }
assert(recoveryAction(KillPoint::AfterCommitNoResponse)===RecoveryAction::ReadBackDatabase);
assert(recoveryAction(KillPoint::AfterProviderNoReceipt)===RecoveryAction::QueryProvider);
echo "KILL_POINT_RECOVERY_POLICY_OK\n";` },
  ],
  "Backup, restore e incidentes PHP": [
    { lang: "php", purpose: "Manifesto de restore fixa backup, engine, schema, release e egress desativado.", code: `<?php declare(strict_types=1);
final readonly class RestoreManifest {
    public function __construct(public string $backupId,public string $sha256,public string $engineVersion,public int $schemaVersion,public string $applicationRelease,public bool $externalEgressEnabled) {
        if($backupId===''||!preg_match('/\\A[a-f0-9]{64}\\z/D',$sha256)||$engineVersion===''||$schemaVersion<1||!preg_match('/\\A[a-f0-9]{40}\\z/D',$applicationRelease)) throw new InvalidArgumentException('restore manifest');
        if($externalEgressEnabled) throw new LogicException('egress must remain disabled during validation');
    }
}
$manifest=new RestoreManifest('backup-2026-09-17',str_repeat('d',64),'PostgreSQL 18.3',42,str_repeat('e',40),false);
assert(!$manifest->externalEgressEnabled&&$manifest->schemaVersion===42);
echo "ISOLATED_RESTORE_MANIFEST_OK\n";` },
    { lang: "php", purpose: "Reconciliação de restore consulta receipt por ID estável antes de liberar novo envio.", code: `<?php declare(strict_types=1);
enum RestoreDispatchDecision { case RecordExistingReceipt; case SafeToDispatch; case KeepUnknown; }
function restoredOutboxDecision(string $localStatus,?string $providerReceipt,bool $providerAbsenceAuthoritative): RestoreDispatchDecision {
    if($providerReceipt!==null&&$providerReceipt!=='') return RestoreDispatchDecision::RecordExistingReceipt;
    if(in_array($localStatus,['pending','unknown'],true)&&$providerAbsenceAuthoritative) return RestoreDispatchDecision::SafeToDispatch;
    return RestoreDispatchDecision::KeepUnknown;
}
assert(restoredOutboxDecision('pending','receipt-77',false)===RestoreDispatchDecision::RecordExistingReceipt);
assert(restoredOutboxDecision('pending',null,false)===RestoreDispatchDecision::KeepUnknown);
assert(restoredOutboxDecision('pending',null,true)===RestoreDispatchDecision::SafeToDispatch);
echo "RESTORE_EFFECT_RECONCILIATION_OK\n";` },
  ],
  "Arquitetura PHP do Quíron": [
    { lang: "php", purpose: "Application service coordena intenção, capacidade e outbox numa transação local sem chamar provider.", code: `<?php declare(strict_types=1);
final readonly class CreateReservationCommand { public function __construct(public string $operationId,public string $actorId,public string $tenantId,public string $key,public string $fingerprint,public string $showId,public int $quantity) {} }
interface TransactionRunner { public function run(callable $operation): mixed; }
interface ReservationUnit { public function claimIntent(CreateReservationCommand $command): string; public function reserve(CreateReservationCommand $command): string; public function appendOutbox(string $tenant,string $reservationId,string $eventId): void; }
final class CreateReservationService {
    public function __construct(private TransactionRunner $transactions,private ReservationUnit $unit) {}
    public function execute(CreateReservationCommand $command): string { return $this->transactions->run(function() use($command): string {
        $intent=$this->unit->claimIntent($command); if($intent!=='new') return $intent;
        $reservation=$this->unit->reserve($command); $this->unit->appendOutbox($command->tenantId,$reservation,'evt_'.$command->operationId); return $reservation;
    }); }
}
assert((new ReflectionMethod(CreateReservationService::class,'execute'))->getNumberOfRequiredParameters()===1);
echo "CHIRON_APPLICATION_BOUNDARY_DEFINED\n";` },
    { lang: "php", purpose: "Outcome fechado traduz domínio para HTTP sem transformar exception desconhecida em conflito.", code: `<?php declare(strict_types=1);
enum ReservationOutcome:string { case Created='created'; case Replayed='replayed'; case Conflict='conflict'; case SoldOut='sold_out'; case Forbidden='forbidden'; case Unknown='unknown'; }
function reservationResponse(ReservationOutcome $outcome,string $operationId): array { return match($outcome){
    ReservationOutcome::Created=>['status'=>201,'body'=>['operation_id'=>$operationId,'outcome'=>'created']],
    ReservationOutcome::Replayed=>['status'=>200,'body'=>['operation_id'=>$operationId,'outcome'=>'replayed']],
    ReservationOutcome::Conflict,ReservationOutcome::SoldOut=>['status'=>409,'body'=>['operation_id'=>$operationId,'outcome'=>$outcome->value]],
    ReservationOutcome::Forbidden=>['status'=>404,'body'=>['operation_id'=>$operationId,'outcome'=>'not_found']],
    ReservationOutcome::Unknown=>['status'=>202,'body'=>['operation_id'=>$operationId,'outcome'=>'unknown']],
}; }
assert(reservationResponse(ReservationOutcome::Created,'op-1')['status']===201);
assert(reservationResponse(ReservationOutcome::Unknown,'op-1')['status']===202);
echo "CHIRON_CLOSED_HTTP_OUTCOMES_OK\n";` },
  ],
  "Última vaga e replay PHP": [
    { lang: "php", purpose: "Transaction de última vaga usa intent único, fingerprint e update condicional com IDs estáveis.", code: `<?php declare(strict_types=1);
function createLastSeat(PDO $db,array $command): string {
    foreach(['tenant','key','fingerprint','show_id','reservation_id','event_id'] as $field) if(!is_string($command[$field]??null)||$command[$field]==='') throw new InvalidArgumentException($field);
    $intent=$db->prepare('INSERT INTO intents(tenant_id,idempotency_key,fingerprint,reservation_id,event_id) VALUES(:tenant,:key,:fingerprint,:reservation_id,:event_id)');
    $intent->execute($command);
    $capacity=$db->prepare('UPDATE shows SET available=available-1 WHERE tenant_id=:tenant AND id=:show_id AND available>=1');
    $capacity->execute(['tenant'=>$command['tenant'],'show_id'=>$command['show_id']]); if($capacity->rowCount()!==1) throw new DomainException('sold out');
    $reservation=$db->prepare("INSERT INTO reservations(tenant_id,id,show_id,status) VALUES(:tenant,:reservation_id,:show_id,'pending')"); $reservation->execute($command);
    $outbox=$db->prepare("INSERT INTO outbox(tenant_id,id,event_type,aggregate_id,status) VALUES(:tenant,:event_id,'reservation.created',:reservation_id,'pending')"); $outbox->execute($command);
    return $command['reservation_id'];
}
assert((new ReflectionFunction('createLastSeat'))->getNumberOfRequiredParameters()===2);
echo "LAST_SEAT_TRANSACTION_DEFINED\n";` },
    { lang: "php", purpose: "Readback após commit ambíguo aceita somente intent scoped com fingerprint idêntico.", code: `<?php declare(strict_types=1);
enum AmbiguousCommitResult { case Replayed; case Conflict; case StillUnknown; }
function resolveAmbiguousCommit(PDO $observer,string $tenant,string $key,string $fingerprint): AmbiguousCommitResult {
    $q=$observer->prepare('SELECT fingerprint,reservation_id,event_id FROM intents WHERE tenant_id=:tenant AND idempotency_key=:key');
    $q->execute(['tenant'=>$tenant,'key'=>$key]); $row=$q->fetch(PDO::FETCH_ASSOC);
    if($row===false) return AmbiguousCommitResult::StillUnknown;
    if(!is_string($row['fingerprint']??null)||!hash_equals($row['fingerprint'],$fingerprint)) return AmbiguousCommitResult::Conflict;
    if(!is_string($row['reservation_id']??null)||!is_string($row['event_id']??null)) throw new UnexpectedValueException('intent row');
    return AmbiguousCommitResult::Replayed;
}
assert((new ReflectionFunction('resolveAmbiguousCommit'))->getNumberOfRequiredParameters()===4);
echo "AMBIGUOUS_COMMIT_READBACK_DEFINED\n";` },
  ],
  "Segurança, testes e carga PHP": [
    { lang: "php", purpose: "Matriz de evidência obriga cada requisito crítico a declarar gate, oracle e artifact.", code: `<?php declare(strict_types=1);
final readonly class EvidenceItem { public function __construct(public string $requirement,public string $gate,public string $oracle,public string $artifact,public string $status) { if(!in_array($status,['passed','failed','pending'],true)) throw new InvalidArgumentException('status'); } }
function assertPublishableEvidence(array $items,array $required): void {
    $byRequirement=[]; foreach($items as $item){if(!$item instanceof EvidenceItem)throw new InvalidArgumentException('item');$byRequirement[$item->requirement]=$item;}
    foreach($required as $name){$item=$byRequirement[$name]??null;if($item===null||$item->status!=='passed'||$item->gate===''||$item->oracle===''||$item->artifact==='')throw new RuntimeException('unproven: '.$name);}
}
$items=[new EvidenceItem('tenant-isolation','same-id-db','zero cross-tenant rows','tenant-report.json','passed'),new EvidenceItem('last-seat','two-session','one winner capacity zero','race-report.json','passed')];
assertPublishableEvidence($items,['tenant-isolation','last-seat']);
echo "EVIDENCE_MATRIX_GATE_OK\n";` },
    { lang: "php", purpose: "Oracle pós-carga cruza capacity, intents, reservations, outbox e provider receipts.", code: `<?php declare(strict_types=1);
function assertChironLoadState(array $summary): void {
    $required=['initial_capacity','created','replayed','conflicts','sold_out','remaining_capacity','intents','reservations','outbox','logical_effects','unknown'];
    if(array_keys($summary)!==$required) throw new InvalidArgumentException('summary');
    assert($summary['remaining_capacity']>=0);
    assert($summary['created']===$summary['reservations']&&$summary['created']===$summary['outbox']);
    assert($summary['remaining_capacity']===$summary['initial_capacity']-$summary['created']);
    assert($summary['logical_effects']===$summary['created']&&$summary['unknown']===0);
    assert($summary['intents']===$summary['created']+$summary['conflicts']+$summary['sold_out']);
}
assertChironLoadState(['initial_capacity'=>2,'created'=>2,'replayed'=>3,'conflicts'=>1,'sold_out'=>1,'remaining_capacity'=>0,'intents'=>4,'reservations'=>2,'outbox'=>2,'logical_effects'=>2,'unknown'=>0]);
echo "CHIRON_LOAD_STATE_ORACLE_OK\n";` },
  ],
  "Banca, deploy e restore PHP": [
    { lang: "php", purpose: "Aprovação final bloqueia publicação quando qualquer executor ou evidência obrigatória está pending.", code: `<?php declare(strict_types=1);
final readonly class GateResult { public function __construct(public string $name,public string $status,public string $artifactDigest) { if(!in_array($status,['passed','failed','pending'],true)||$name==='')throw new InvalidArgumentException('gate'); } }
function approvePhpSource(array $gates,string $contentDigest): string {
    $required=['structure','editorial','php-runtime','composer','database','http-proxy','worker-provider','security-browser','load-kill-restore','suite-typecheck-build'];
    $byName=[];foreach($gates as $gate){if(!$gate instanceof GateResult)throw new InvalidArgumentException('gate item');$byName[$gate->name]=$gate;}
    foreach($required as $name){$gate=$byName[$name]??null;if($gate===null||$gate->status!=='passed'||$gate->artifactDigest!==$contentDigest)throw new RuntimeException('gate not approved: '.$name);}
    return hash('sha256',$contentDigest."\0".implode("\0",$required));
}
$reflection=new ReflectionFunction('approvePhpSource'); assert($reflection->getNumberOfRequiredParameters()===2);
echo "PHP_PUBLICATION_GATE_DEFINED\n";` },
    { lang: "php", purpose: "Restore drill preserva IDs e exige reconciliação sem egress antes de liberar tráfego.", code: `<?php declare(strict_types=1);
final class RestoreDrillState {
    public function __construct(public bool $egressEnabled=false,public bool $catalogValid=false,public bool $invariantsValid=false,public bool $receiptsReconciled=false,public bool $oldWriterFenced=false) {}
    public function mayEnableTraffic(): bool { return !$this->egressEnabled&&$this->catalogValid&&$this->invariantsValid&&$this->receiptsReconciled&&$this->oldWriterFenced; }
    public function enableTraffic(): void { if(!$this->mayEnableTraffic()) throw new LogicException('restore not safe'); $this->egressEnabled=true; }
}
$drill=new RestoreDrillState(); assert(!$drill->mayEnableTraffic());
$drill->catalogValid=$drill->invariantsValid=$drill->receiptsReconciled=$drill->oldWriterFenced=true;
assert($drill->mayEnableTraffic()); $drill->enableTraffic(); assert($drill->egressEnabled);
echo "RESTORE_RELEASE_GATE_OK\n";` },
  ],
};
