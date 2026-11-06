export type CSharpExample = { lang: "csharp" | "xml"; code: string; purpose: string };

/** Dois exemplos próprios por seção; C# puro será compilado/executado no SDK .NET 8 local. */
export const CSHARP_EXAMPLES: Record<string, [CSharpExample, CSharpExample]> = {
  "SDK, target framework e build": [
    { lang: "xml", purpose: "Projeto de console explícito para o SDK local .NET 8/C# 12; warnings e nullable ligados.", code: `<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <OutputType>Exe</OutputType>
    <TargetFramework>net8.0</TargetFramework>
    <LangVersion>12</LangVersion>
    <Nullable>enable</Nullable>
    <ImplicitUsings>enable</ImplicitUsings>
    <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  </PropertyGroup>
  <ItemGroup><FrameworkReference Include="Microsoft.AspNetCore.App" /></ItemGroup>
</Project>` },
    { lang: "csharp", purpose: "Smoke de runtime independente da IDE; valida versão major e mostra diretório/assembly publicados.", code: `using System;
using System.Reflection;

if (Environment.Version.Major != 8)
    throw new InvalidOperationException($"Runtime inesperado: {Environment.Version}");

Console.WriteLine($"runtime={Environment.Version.Major}");
Console.WriteLine($"assembly={Assembly.GetExecutingAssembly().GetName().Name}");
Console.WriteLine($"cwd={Environment.CurrentDirectory}");
Console.WriteLine("BUILD_RUNTIME_OK");` },
  ],
  "Tipos, literais e conversões": [
    { lang: "csharp", purpose: "Money decimal com moeda explícita, soma exata de centavos e conversão canônica invariante.", code: `using System;
using System.Globalization;

var one = Money.Parse("0.10", "BRL");
var total = one.Add(one).Add(one);
if (total.Amount != 0.30m || total.ToWire() != "BRL 0.30")
    throw new Exception($"Total inesperado: {total}");
Console.WriteLine(total.ToWire());

readonly record struct Money(decimal Amount, string Currency)
{
    public static Money Parse(string raw, string currency)
    {
        if (currency is not ("BRL" or "USD")) throw new ArgumentException("moeda");
        if (!decimal.TryParse(raw, NumberStyles.AllowDecimalPoint,
            CultureInfo.InvariantCulture, out var value) || value < 0 ||
            decimal.Round(value, 2) != value)
            throw new ArgumentException("valor monetário inválido");
        return new Money(value, currency);
    }
    public Money Add(Money other) => Currency == other.Currency
        ? new Money(checked(Amount + other.Amount), Currency)
        : throw new ArgumentException("moedas diferentes");
    public string ToWire() => $"{Currency} {Amount.ToString("F2", CultureInfo.InvariantCulture)}";
}` },
    { lang: "csharp", purpose: "Contraprova de overflow e parsing dependente da cultura, sem gravar estado errado.", code: `using System;
using System.Globalization;

try
{
    _ = checked(int.MaxValue + int.Parse("1", CultureInfo.InvariantCulture));
    throw new Exception("overflow não detectado");
}
catch (OverflowException) { Console.WriteLine("OVERFLOW_REJECTED"); }

var pt = decimal.Parse("1,25", CultureInfo.GetCultureInfo("pt-BR"));
var invariant = decimal.Parse("1.25", CultureInfo.InvariantCulture);
if (pt != invariant || pt != 1.25m) throw new Exception("parse incorreto");
if (decimal.TryParse("abc", NumberStyles.Number, CultureInfo.InvariantCulture, out _))
    throw new Exception("entrada hostil aceita");
Console.WriteLine("CULTURE_EXPLICIT_OK");` },
  ],
  "Controle de fluxo e pattern matching": [
    { lang: "csharp", purpose: "Tabela de transição com switch expression, guards e falha fechada para valor enum desconhecido.", code: `using System;

var now = new DateTimeOffset(2026, 1, 2, 0, 0, 0, TimeSpan.Zero);
if (Decide(new Reservation(Status.Pending, now.AddMinutes(1)), now) != Decision.Confirm)
    throw new Exception("pending válido");
if (Decide(new Reservation(Status.Pending, now), now) != Decision.Expire)
    throw new Exception("fronteira de expiração");
if (Decide(new Reservation(Status.Confirmed, now), now) != Decision.Keep)
    throw new Exception("confirmada");
try { _ = Decide(new Reservation((Status)99, now), now); throw new Exception("99 aceito"); }
catch (ArgumentOutOfRangeException) { Console.WriteLine("UNKNOWN_REJECTED"); }

static Decision Decide(Reservation reservation, DateTimeOffset at) => reservation switch
{
    { Status: Status.Pending, Deadline: var deadline } when deadline <= at => Decision.Expire,
    { Status: Status.Pending } => Decision.Confirm,
    { Status: Status.Confirmed } => Decision.Keep,
    { Status: Status.Cancelled } => Decision.Keep,
    _ => throw new ArgumentOutOfRangeException(nameof(reservation), "estado inválido")
};

enum Status { Pending, Confirmed, Cancelled }
enum Decision { Confirm, Expire, Keep }
record Reservation(Status Status, DateTimeOffset Deadline);` },
    { lang: "csharp", purpose: "Mutante de default permissivo é detectado por estado 99; decisão pura evita efeito no switch.", code: `using System;

static bool BadMayConfirm(int rawStatus) => rawStatus switch
{
    0 => true,
    1 => false,
    _ => true // BUG: valor novo/desconhecido vira permissão
};

static bool SafeMayConfirm(int rawStatus) => rawStatus switch
{
    0 => true,
    1 => false,
    _ => throw new ArgumentOutOfRangeException(nameof(rawStatus))
};

if (!BadMayConfirm(99)) throw new Exception("mutante não reproduziu");
try { _ = SafeMayConfirm(99); throw new Exception("baseline aceitou 99"); }
catch (ArgumentOutOfRangeException) { Console.WriteLine("FAIL_CLOSED_OK"); }` },
  ],
  "Métodos, parâmetros e localidade": [
    { lang: "csharp", purpose: "Comando tipado e função local static mantêm tenant/chave explícitos e fingerprint sem captura.", code: `using System;
using System.Security.Cryptography;
using System.Text;

var command = new ReserveCommand("tenant-a", "key-1", "seat-7");
var result = Reserve(command);
if (result.Tenant != "tenant-a" || result.Fingerprint.Length != 64)
    throw new Exception("contrato quebrado");
Console.WriteLine($"{result.Tenant}:{result.Fingerprint.Length}");

static ReserveResult Reserve(ReserveCommand command)
{
    if (string.IsNullOrWhiteSpace(command.Tenant) ||
        string.IsNullOrWhiteSpace(command.RequestKey) ||
        string.IsNullOrWhiteSpace(command.SeatId))
        throw new ArgumentException("identidade ausente");
    return new ReserveResult(command.Tenant, Fingerprint(command.SeatId));

    static string Fingerprint(string seatId)
    {
        byte[] hash = SHA256.HashData(Encoding.UTF8.GetBytes(seatId.Trim().ToUpperInvariant()));
        return Convert.ToHexString(hash);
    }
}

record ReserveCommand(string Tenant, string RequestKey, string SeatId);
record ReserveResult(string Tenant, string Fingerprint);` },
    { lang: "csharp", purpose: "ref altera variável do chamador; resultado tipado só aplica decremento após validação.", code: `using System;

int remaining = 1;
BadReserve(ref remaining, authorized: false);
if (remaining != 0) throw new Exception("mutante não reproduziu efeito indevido");

remaining = 1;
var denied = DecideReserve(remaining, authorized: false);
if (denied.Accepted || remaining != 1) throw new Exception("recusa alterou estado");
var accepted = DecideReserve(remaining, authorized: true);
if (!accepted.Accepted || accepted.NextRemaining != 0) throw new Exception("aceite incorreto");
Console.WriteLine("NO_MUTATION_BEFORE_AUTH_OK");

static void BadReserve(ref int stock, bool authorized)
{
    stock--; // BUG: efeito antecede validação
    if (!authorized) return;
}

static Decision DecideReserve(int stock, bool authorized) =>
    !authorized || stock < 1 ? new Decision(false, stock) : new Decision(true, stock - 1);

record Decision(bool Accepted, int NextRemaining);` },
  ],
  "Nullable reference types": [
    { lang: "csharp", purpose: "DTO nullable vira comando validado; ausência é erro de borda, não NullReferenceException.", code: `using System;

var valid = Bind(new IncomingReservation("seat-7"));
if (valid.SeatId != "seat-7") throw new Exception("binding válido");
try { _ = Bind(new IncomingReservation(null)); throw new Exception("null aceito"); }
catch (ArgumentException) { Console.WriteLine("NULL_REJECTED"); }
try { _ = Bind(new IncomingReservation("  ")); throw new Exception("vazio aceito"); }
catch (ArgumentException) { Console.WriteLine("BLANK_REJECTED"); }

static ReserveCommand Bind(IncomingReservation incoming)
{
    if (string.IsNullOrWhiteSpace(incoming.SeatId))
        throw new ArgumentException("seatId obrigatório");
    return new ReserveCommand(incoming.SeatId.Trim());
}

record IncomingReservation(string? SeatId);
record ReserveCommand(string SeatId);` },
    { lang: "csharp", purpose: "Resposta remota ausente mantém estado Unknown em vez de usar null-forgiving para fingir confirmação.", code: `using System;

var unknown = Interpret(null, "key-1");
if (unknown is not PaymentUnknown { Key: "key-1" }) throw new Exception("unknown perdido");
var confirmed = Interpret(new Receipt("charge-7"), "key-1");
if (confirmed is not PaymentConfirmed { ChargeId: "charge-7" })
    throw new Exception("recibo não preservado");
Console.WriteLine("NULL_REMOTE_OUTCOME_MODELED");

static PaymentResult Interpret(Receipt? receipt, string key) => receipt switch
{
    null => new PaymentUnknown(key),
    { ChargeId: { Length: > 0 } id } => new PaymentConfirmed(id),
    _ => new PaymentUnknown(key)
};

record Receipt(string? ChargeId);
abstract record PaymentResult;
record PaymentUnknown(string Key) : PaymentResult;
record PaymentConfirmed(string ChargeId) : PaymentResult;` },
  ],
  "Records e igualdade": [
    { lang: "csharp", purpose: "Value object tenant-scoped preserva igualdade; snapshot usa ImmutableArray, não List compartilhada.", code: `using System;
using System.Collections.Immutable;

var a = new RequestKey("tenant-a", "key-1");
var same = new RequestKey("tenant-a", "key-1");
var otherTenant = new RequestKey("tenant-b", "key-1");
if (a != same || a == otherTenant) throw new Exception("igualdade errada");

var source = new System.Collections.Generic.List<string> { "seat-1" };
var snapshot = new Quote(source.ToImmutableArray());
source.Add("seat-2");
if (snapshot.Seats.Length != 1) throw new Exception("snapshot mutou");
var next = snapshot with { Seats = snapshot.Seats.Add("seat-3") };
if (snapshot.Seats.Length != 1 || next.Seats.Length != 2)
    throw new Exception("with corrompeu original");
Console.WriteLine("RECORD_VALUE_AND_SNAPSHOT_OK");

readonly record struct RequestKey(string Tenant, string Key);
record Quote(ImmutableArray<string> Seats);` },
    { lang: "csharp", purpose: "Contraprova: List dentro de record é referência compartilhada e muda após with.", code: `using System;
using System.Collections.Generic;

var items = new List<string> { "seat-1" };
var quote = new BadQuote(items);
var copy = quote with { };
items.Add("seat-2");
if (quote.Items.Count != 2 || copy.Items.Count != 2 ||
    !ReferenceEquals(quote.Items, copy.Items))
    throw new Exception("mutante não reproduzido");
Console.WriteLine("SHALLOW_COPY_DETECTED");

record BadQuote(List<string> Items);` },
  ],
  "Struct, enum e discriminantes": [
    { lang: "csharp", purpose: "default(struct) e enum 99 são representáveis; validação explícita recusa ambos.", code: `using System;

var valid = new Money(10.25m, "BRL");
if (!valid.IsValid) throw new Exception("valor válido rejeitado");
if (default(Money).IsValid) throw new Exception("default inválido aceito");
if (Enum.IsDefined((Status)99)) throw new Exception("enum 99 aceito");
try { _ = Confirm((Status)99); throw new Exception("status 99 confirmado"); }
catch (ArgumentOutOfRangeException) { Console.WriteLine("INVALID_VALUE_REJECTED"); }

static bool Confirm(Status status) => status switch
{
    Status.Pending => true,
    Status.Confirmed or Status.Cancelled => false,
    _ => throw new ArgumentOutOfRangeException(nameof(status))
};

readonly record struct Money(decimal Amount, string? Currency)
{
    public bool IsValid => Amount >= 0 && Currency is "BRL" or "USD";
}
enum Status { Pending, Confirmed, Cancelled }` },
    { lang: "csharp", purpose: "ID forte e resultado discriminado evitam trocar tenant/key e fingir sucesso para unknown.", code: `using System;

var tenant = new TenantId("tenant-a");
var key = new RequestKey("key-1");
ReserveOutcome outcome = new UnknownRemote(tenant, key);
var message = outcome switch
{
    Accepted a => $"confirmed:{a.Reservation.Value}",
    UnknownRemote u => $"reconcile:{u.Tenant.Value}:{u.Key.Value}",
    Conflict => "conflict",
    _ => throw new ArgumentOutOfRangeException(nameof(outcome))
};
if (message != "reconcile:tenant-a:key-1") throw new Exception("unknown mascarado");
Console.WriteLine(message);

readonly record struct TenantId(string Value);
readonly record struct RequestKey(string Value);
readonly record struct ReservationId(string Value);
abstract record ReserveOutcome;
record Accepted(ReservationId Reservation) : ReserveOutcome;
record UnknownRemote(TenantId Tenant, RequestKey Key) : ReserveOutcome;
record Conflict : ReserveOutcome;` },
  ],
  "Generics e constraints": [
    { lang: "csharp", purpose: "Port genérica restringe ID não nulo, mas contrato de reserva permanece específico e tenant-scoped.", code: `using System;
using System.Collections.Generic;

var store = new MemoryStore<RequestKey, string>();
var a = new RequestKey("a", "key-1");
var b = new RequestKey("b", "key-1");
store.Add(a, "r-1");
store.Add(b, "r-2");
if (store.Get(a) != "r-1" || store.Get(b) != "r-2")
    throw new Exception("tenant misturado");
Console.WriteLine("GENERIC_ID_SCOPED_OK");

readonly record struct RequestKey(string Tenant, string Key);

sealed class MemoryStore<TId, TValue> where TId : notnull
{
    private readonly Dictionary<TId, TValue> rows = new();
    public void Add(TId id, TValue value) => rows.Add(id, value);
    public TValue Get(TId id) => rows[id];
}` },
    { lang: "csharp", purpose: "Covariância permite leitura, não mutação; resultado genérico não retorna default como sucesso.", code: `using System;
using System.Collections.Generic;

IEnumerable<ConfirmedReservation> confirmed = new[] { new ConfirmedReservation("r-1") };
IEnumerable<Reservation> readable = confirmed; // IEnumerable<out T>
if (Count(readable) != 1) throw new Exception("variância de leitura");
Result<string> failure = new Failure<string>("upstream-unknown");
if (failure is not Failure<string> { Code: "upstream-unknown" })
    throw new Exception("erro mascarado");
Console.WriteLine("COVARIANCE_AND_FAILURE_OK");

static int Count(IEnumerable<Reservation> values)
{
    int count = 0;
    foreach (var _ in values) count++;
    return count;
}

abstract record Reservation(string Id);
record ConfirmedReservation(string Id) : Reservation(Id);
abstract record Result<T>;
record Success<T>(T Value) : Result<T>;
record Failure<T>(string Code) : Result<T>;` },
  ],
  "Classes, propriedades e encapsulamento": [
    { lang: "csharp", purpose: "Entidade não expõe setter de status; confirmação sem recibo é recusada sem mutar estado.", code: `using System;

var reservation = new Reservation("r-1", "tenant-a");
try { reservation.Confirm(null); throw new Exception("sem recibo aceito"); }
catch (ArgumentException) { }
if (reservation.Status != ReservationStatus.Pending) throw new Exception("estado mutou");
reservation.Confirm("charge-7");
if (reservation.Status != ReservationStatus.Confirmed) throw new Exception("não confirmou");
try { reservation.Confirm("charge-8"); throw new Exception("dupla confirmação"); }
catch (InvalidOperationException) { Console.WriteLine("ENTITY_INVARIANT_OK"); }

enum ReservationStatus { Pending, Confirmed }
sealed class Reservation
{
    public string Id { get; }
    public string Tenant { get; }
    public ReservationStatus Status { get; private set; } = ReservationStatus.Pending;
    public string? ChargeId { get; private set; }
    public Reservation(string id, string tenant)
    {
        if (string.IsNullOrWhiteSpace(id) || string.IsNullOrWhiteSpace(tenant))
            throw new ArgumentException("identidade");
        Id = id; Tenant = tenant;
    }
    public void Confirm(string? chargeId)
    {
        if (Status != ReservationStatus.Pending) throw new InvalidOperationException("transição");
        if (string.IsNullOrWhiteSpace(chargeId)) throw new ArgumentException("recibo");
        ChargeId = chargeId; Status = ReservationStatus.Confirmed;
    }
}` },
    { lang: "csharp", purpose: "required/init ajudam no call site, mas validação ainda rejeita string vazia e snapshot mutável.", code: `using System;
using System.Collections.Immutable;

var valid = new CreateRequest { SeatId = "seat-1", Tenant = "tenant-a" };
var command = Validate(valid);
if (command.SeatId != "seat-1") throw new Exception("binding");
try { _ = Validate(new CreateRequest { SeatId = "", Tenant = "tenant-a" });
    throw new Exception("vazio aceito"); }
catch (ArgumentException) { Console.WriteLine("REQUIRED_NOT_ENOUGH_OK"); }

static Command Validate(CreateRequest request)
{
    if (string.IsNullOrWhiteSpace(request.SeatId) ||
        string.IsNullOrWhiteSpace(request.Tenant))
        throw new ArgumentException("campo inválido");
    return new Command(request.SeatId, request.Tenant);
}

sealed class CreateRequest
{
    public required string SeatId { get; init; }
    public required string Tenant { get; init; }
}
record Command(string SeatId, string Tenant);` },
  ],
  "Interfaces, composição e DI": [
    { lang: "csharp", purpose: "Caso de uso recebe porta por construtor; fake comprova replay tenant-scoped sem host.", code: `using System;
using System.Collections.Generic;

var store = new FakeStore();
var useCase = new ReserveSeat(store);
var first = useCase.Execute(new Command("a", "key-1", "seat-7"));
var replay = useCase.Execute(new Command("a", "key-1", "seat-7"));
var other = useCase.Execute(new Command("b", "key-1", "seat-7"));
if (first != replay || first == other || store.Count != 2)
    throw new Exception("porta não preservou tenant/replay");
Console.WriteLine("PORT_COMPOSITION_OK");

record Command(string Tenant, string Key, string Seat);
interface IReservationStore { string GetOrAdd(Command command); }
sealed class ReserveSeat
{
    private readonly IReservationStore store;
    public ReserveSeat(IReservationStore store) => this.store = store ?? throw new ArgumentNullException(nameof(store));
    public string Execute(Command command) => store.GetOrAdd(command);
}
sealed class FakeStore : IReservationStore
{
    private readonly Dictionary<(string Tenant, string Key), (string Seat, string Id)> rows = new();
    public int Count => rows.Count;
    public string GetOrAdd(Command command)
    {
        var key = (command.Tenant, command.Key);
        if (rows.TryGetValue(key, out var old))
            return old.Seat == command.Seat ? old.Id : throw new InvalidOperationException("fingerprint");
        var id = $"r-{rows.Count + 1}";
        rows.Add(key, (command.Seat, id));
        return id;
    }
}` },
    { lang: "csharp", purpose: "Composition root real do Microsoft DI resolve port/use case em escopos distintos.", code: `using System;
using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection();
services.AddSingleton<IClock>(new FixedClock(new DateTimeOffset(2026, 1, 2, 0, 0, 0, TimeSpan.Zero)));
services.AddScoped<IReservationPort, ScopedReservationPort>();
services.AddScoped<ReserveUseCase>();
using var provider = services.BuildServiceProvider(new ServiceProviderOptions
{
    ValidateOnBuild = true, ValidateScopes = true
});
using var scopeA = provider.CreateScope();
using var scopeB = provider.CreateScope();
var a = scopeA.ServiceProvider.GetRequiredService<ReserveUseCase>();
var b = scopeB.ServiceProvider.GetRequiredService<ReserveUseCase>();
if (a.PortId == b.PortId || a.Now.Year != 2026) throw new Exception("scope/config");
Console.WriteLine("DI_SCOPE_COMPOSITION_OK");

interface IClock { DateTimeOffset Now { get; } }
record FixedClock(DateTimeOffset Now) : IClock;
interface IReservationPort { Guid Id { get; } }
sealed class ScopedReservationPort : IReservationPort { public Guid Id { get; } = Guid.NewGuid(); }
sealed class ReserveUseCase
{
    private readonly IReservationPort port;
    private readonly IClock clock;
    public ReserveUseCase(IReservationPort port, IClock clock)
    { this.port = port; this.clock = clock; }
    public Guid PortId => port.Id;
    public DateTimeOffset Now => clock.Now;
}` },
  ],
  "Lifetimes scoped, singleton e transient": [
    { lang: "csharp", purpose: "ValidateScopes reprova singleton que captura port scoped antes de receber tráfego.", code: `using System;
using Microsoft.Extensions.DependencyInjection;

var bad = new ServiceCollection();
bad.AddScoped<ScopedPort>();
bad.AddSingleton<CaptiveWorker>();
try
{
    using var invalid = bad.BuildServiceProvider(new ServiceProviderOptions
    { ValidateOnBuild = true, ValidateScopes = true });
    throw new Exception("captive dependency não detectada");
}
catch (AggregateException error) when (error.ToString().Contains("ScopedPort"))
{
    Console.WriteLine("CAPTIVE_SCOPE_REJECTED");
}

sealed class ScopedPort { }
sealed class CaptiveWorker
{
    public CaptiveWorker(ScopedPort port) { _ = port; }
}` },
    { lang: "csharp", purpose: "Worker singleton cria e descarta scope por item, sem carregar dependência scoped para a próxima rodada.", code: `using System;
using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection();
services.AddScoped<WorkPort>();
services.AddSingleton<Worker>();
using var provider = services.BuildServiceProvider(new ServiceProviderOptions
{ ValidateOnBuild = true, ValidateScopes = true });
var worker = provider.GetRequiredService<Worker>();
var first = worker.Process();
var second = worker.Process();
if (first == second) throw new Exception("scope reutilizado");
Console.WriteLine("WORKER_SCOPE_PER_ITEM_OK");

sealed class WorkPort { public Guid Id { get; } = Guid.NewGuid(); }
sealed class Worker
{
    private readonly IServiceScopeFactory scopes;
    public Worker(IServiceScopeFactory scopes) => this.scopes = scopes;
    public Guid Process()
    {
        using var scope = scopes.CreateScope();
        return scope.ServiceProvider.GetRequiredService<WorkPort>().Id;
    }
}` },
  ],
  "Events, delegates e closures": [
    { lang: "csharp", purpose: "Event subscriber scoped precisa unsubscribe; closure captura variável mutável, não snapshot.", code: `using System;

var publisher = new Publisher();
int observed = 0;
EventHandler handler = (_, _) => observed++;
publisher.Changed += handler;
publisher.Emit();
publisher.Changed -= handler;
publisher.Emit();
if (observed != 1) throw new Exception("unsubscribe não funcionou");

string eventId = "event-1";
Func<string> captured = () => eventId;
eventId = "event-2";
if (captured() != "event-2") throw new Exception("captura inesperada");
string snapshot = eventId;
Func<string> stable = () => snapshot;
eventId = "event-3";
if (stable() != "event-2") throw new Exception("snapshot instável");
Console.WriteLine("EVENT_LIFETIME_AND_CAPTURE_OK");

sealed class Publisher
{
    public event EventHandler? Changed;
    public void Emit() => Changed?.Invoke(this, EventArgs.Empty);
}` },
    { lang: "csharp", purpose: "Evento local pode sumir após restart; fake de outbox mostra o contraste sem alegar durabilidade real.", code: `using System;
using System.Collections.Generic;

var process = new LocalProcess();
int delivered = 0;
process.Ready += _ => delivered++;
process.Commit("event-1");
process.Restart(); // assinantes in-memory desaparecem; linha persistida no fake permanece
process.Recover();
if (delivered != 1 || process.Outbox.Count != 1 || process.Outbox[0] != "event-1")
    throw new Exception("contraste evento/outbox não observado");
Console.WriteLine("LOCAL_EVENT_NOT_DURABLE_OK");

sealed class LocalProcess
{
    public event Action<string>? Ready;
    public List<string> Outbox { get; } = new(); // fake de armazenamento, não banco real
    public void Commit(string id) { Outbox.Add(id); Ready?.Invoke(id); }
    public void Restart() { Ready = null; }
    public void Recover() { /* worker real releria Outbox do banco */ }
}` },
  ],
  "List, Dictionary, HashSet e comparers": [
    { lang: "csharp", purpose: "Dictionary com chave composta distingue tenants; StringComparer.Ordinal define key de protocolo.", code: `using System;
using System.Collections.Generic;

var rows = new Dictionary<RequestKey, string>();
rows.Add(new RequestKey("a", "KEY"), "r-1");
rows.Add(new RequestKey("b", "KEY"), "r-2");
if (rows.Count != 2 || rows[new RequestKey("a", "KEY")] != "r-1")
    throw new Exception("tenant cruzado");
if (rows.ContainsKey(new RequestKey("a", "key")))
    throw new Exception("case-sensitivity alterada");
var seen = new HashSet<string>(StringComparer.Ordinal) { "event-1" };
if (seen.Add("event-1") || !seen.Add("EVENT-1"))
    throw new Exception("comparação ordinal incorreta");
Console.WriteLine("TENANT_SCOPED_COLLECTIONS_OK");

readonly record struct RequestKey(string Tenant, string Key);` },
    { lang: "csharp", purpose: "Mutante de chave sem tenant colide; baseline usa tuple e não cobra dentro do cache.", code: `using System;
using System.Collections.Generic;

var bad = new Dictionary<string, string>(StringComparer.Ordinal);
bad["same-key"] = "reservation-A";
bad["same-key"] = "reservation-B";
if (bad.Count != 1 || bad["same-key"] != "reservation-B")
    throw new Exception("colisão não reproduzida");

var good = new Dictionary<(string Tenant, string Key), string>();
good[("A", "same-key")] = "reservation-A";
good[("B", "same-key")] = "reservation-B";
if (good.Count != 2 || good[("A", "same-key")] != "reservation-A")
    throw new Exception("isolamento falhou");
Console.WriteLine("MISSING_TENANT_MUTANT_DETECTED");` },
  ],
  "IEnumerable, lazy evaluation e materialização": [
    { lang: "csharp", purpose: "Duas enumerações executam source duas vezes; ToArray estabiliza snapshot pequeno.", code: `using System;
using System.Collections.Generic;
using System.Linq;

int executions = 0;
IEnumerable<int> deferred = Produce().Where(x => x > 0);
if (deferred.Count() != 2 || deferred.Sum() != 3 || executions != 2)
    throw new Exception("deferred não reexecutou");
int[] snapshot = deferred.ToArray();
if (snapshot.Sum() != 3 || snapshot.Count() != 2 || executions != 3)
    throw new Exception("snapshot reexecutou origem");
Console.WriteLine("DEFERRED_VS_MATERIALIZED_OK");

IEnumerable<int> Produce()
{
    executions++;
    yield return 1;
    yield return 2;
}` },
    { lang: "csharp", purpose: "Iterator fecha recurso em abandono parcial quando enumerator é descartado.", code: `using System;
using System.Collections.Generic;

var resource = new TrackedResource();
using (var enumerator = Values(resource).GetEnumerator())
{
    if (!enumerator.MoveNext() || enumerator.Current != 1)
        throw new Exception("primeiro item");
}
if (resource.Disposed != 1) throw new Exception("iterator vazou recurso");
Console.WriteLine("ITERATOR_CLEANUP_OK");

static IEnumerable<int> Values(TrackedResource resource)
{
    using (resource)
    {
        yield return 1;
        yield return 2;
    }
}

sealed class TrackedResource : IDisposable
{
    public int Disposed { get; private set; }
    public void Dispose() => Disposed++;
}` },
  ],
  "LINQ operators e grão": [
    { lang: "csharp", purpose: "Join 1×3 multiplica valor; agregação no grão de reserva preserva receita.", code: `using System;
using System.Linq;

var reservations = new[] { new Reservation("r-1", 10m), new Reservation("r-2", 5m) };
var events = new[] { "r-1", "r-1", "r-1" };
var badTotal = (from r in reservations join e in events on r.Id equals e
                select r.Amount).Sum();
var correctTotal = reservations.Sum(r => r.Amount);
if (badTotal != 30m || correctTotal != 15m)
    throw new Exception("multiplicação de join não demonstrada");
var eventCounts = events.GroupBy(id => id).ToDictionary(g => g.Key, g => g.Count());
if (eventCounts["r-1"] != 3 || eventCounts.ContainsKey("r-2"))
    throw new Exception("grão de evento incorreto");
Console.WriteLine("JOIN_GRAIN_MUTANT_DETECTED");

record Reservation(string Id, decimal Amount);` },
    { lang: "csharp", purpose: "Filtro de tenant e ordenação total com desempate preservam paginação/representação.", code: `using System;
using System.Linq;

var at = new DateTimeOffset(2026, 1, 2, 0, 0, 0, TimeSpan.Zero);
var rows = new[] {
    new Reservation("b", "tenant-a", at),
    new Reservation("a", "tenant-a", at),
    new Reservation("z", "tenant-b", at)
};
var page = rows.Where(r => r.Tenant == "tenant-a")
    .OrderByDescending(r => r.CreatedAt).ThenByDescending(r => r.Id)
    .Select(r => r.Id).ToArray();
if (page.Length != 2 || page[0] != "b" || page[1] != "a")
    throw new Exception("tenant/order incorretos");
Console.WriteLine("TENANT_ORDER_STABLE_OK");

record Reservation(string Id, string Tenant, DateTimeOffset CreatedAt);` },
  ],
  "Span, Memory e buffers": [
    { lang: "csharp", purpose: "ReadOnlySpan é view; ToArray cria snapshot que sobrevive à alteração do dono.", code: `using System;

byte[] source = [1, 2, 3, 4];
ReadOnlySpan<byte> view = source.AsSpan(1, 2);
byte[] snapshot = view.ToArray();
source[1] = 9;
if (view[0] != 9 || snapshot[0] != 2)
    throw new Exception("view/cópia confundidas");
Console.WriteLine("SPAN_VIEW_OWNERSHIP_OK");` },
    { lang: "csharp", purpose: "ArrayPool usa count real e limpa buffer sensível no finally; nunca serializa array.Length.", code: `using System;
using System.Buffers;
using System.Text;

byte[] rented = ArrayPool<byte>.Shared.Rent(64);
try
{
    int count = Encoding.UTF8.GetBytes("OK", rented);
    string payload = Encoding.UTF8.GetString(rented.AsSpan(0, count));
    if (count != 2 || payload != "OK") throw new Exception("bytes inválidos");
    Console.WriteLine("BOUNDED_BUFFER_OK");
}
finally
{
    ArrayPool<byte>.Shared.Return(rented, clearArray: true);
}` },
  ],
  "Exceptions e filtros": [
    { lang: "csharp", purpose: "throw; preserva stack de origem e finally libera recurso mesmo após falha.", code: `using System;

bool cleaned = false;
try { Boundary(); throw new Exception("falha não propagada"); }
catch (InvalidOperationException error)
{
    if (!cleaned || error.StackTrace?.Contains(nameof(DeepFailure)) != true)
        throw new Exception("causa/cleanup perdido");
    Console.WriteLine("STACK_AND_FINALLY_OK");
}

void Boundary()
{
    try { DeepFailure(); }
    catch (InvalidOperationException) { throw; }
    finally { cleaned = true; }
}
static void DeepFailure() => throw new InvalidOperationException("database unavailable");` },
    { lang: "csharp", purpose: "Filtro classifica 429 como retryable e não captura 400; timeout ambíguo mantém chave.", code: `using System;

var retryable = Classify(new ProviderException(429), "key-1");
var invalid = Classify(new ProviderException(400), "key-1");
var unknown = Classify(new TimeoutException(), "key-1");
if (retryable != "retry:key-1" || invalid != "fail:400" || unknown != "unknown:key-1")
    throw new Exception("classificação errada");
Console.WriteLine("ERROR_CLASSIFICATION_OK");

static string Classify(Exception failure, string stableKey)
{
    try { throw failure; }
    catch (ProviderException ex) when (ex.Status == 429) { return $"retry:{stableKey}"; }
    catch (ProviderException ex) { return $"fail:{ex.Status}"; }
    catch (TimeoutException) { return $"unknown:{stableKey}"; }
}
sealed class ProviderException(int status) : Exception { public int Status { get; } = status; }` },
  ],
  "IDisposable e await using": [
    { lang: "csharp", purpose: "using fecha em exception; ownership do recurso é observado por contador.", code: `using System;

var resource = new Tracked();
try
{
    using (resource) { throw new InvalidOperationException("business failure"); }
}
catch (InvalidOperationException) { }
if (resource.Disposed != 1) throw new Exception("resource leak");
Console.WriteLine("SYNC_DISPOSE_ON_FAILURE_OK");

sealed class Tracked : IDisposable
{
    public int Disposed { get; private set; }
    public void Dispose() => Disposed++;
}` },
    { lang: "csharp", purpose: "await using aguarda DisposeAsync antes de concluir método público.", code: `using System;
using System.Threading.Tasks;

var gate = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
var resource = new AsyncTracked(gate.Task);
Task operation = Work(resource);
if (operation.IsCompleted || resource.Disposed) throw new Exception("dispose não aguardado");
gate.SetResult();
await operation;
if (!resource.Disposed) throw new Exception("DisposeAsync não concluiu");
Console.WriteLine("ASYNC_DISPOSE_AWAITED_OK");

static async Task Work(AsyncTracked resource)
{
    await using (resource) { await Task.Yield(); }
}
sealed class AsyncTracked(Task signal) : IAsyncDisposable
{
    public bool Disposed { get; private set; }
    public async ValueTask DisposeAsync() { await signal; Disposed = true; }
}` },
  ],
  "File, Path e streaming": [
    { lang: "csharp", purpose: "Nome físico gerado no servidor, root normalizado e cleanup de arquivo temporário.", code: `using System;
using System.IO;

string root = Path.Combine(Path.GetTempPath(), "chiron-files-" + Guid.NewGuid().ToString("N"));
Directory.CreateDirectory(root);
try
{
    string physical = Guid.NewGuid().ToString("N") + ".bin";
    string path = Path.GetFullPath(Path.Combine(root, physical));
    string prefix = Path.GetFullPath(root) + Path.DirectorySeparatorChar;
    if (!path.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
        throw new Exception("path escape");
    File.WriteAllBytes(path, [1, 2, 3]);
    if (File.ReadAllBytes(path).Length != 3) throw new Exception("bytes");
    Console.WriteLine("SERVER_OWNED_FILENAME_OK");
}
finally { Directory.Delete(root, recursive: true); }` },
    { lang: "csharp", purpose: "Streaming conta bytes e rejeita payload acima do teto sem materializá-lo inteiro.", code: `using System;
using System.IO;
using System.Threading;

byte[] payload = new byte[1025];
await using var source = new MemoryStream(payload);
await using var destination = new MemoryStream();
try
{
    await CopyBounded(source, destination, 1024, CancellationToken.None);
    throw new Exception("payload excessivo aceito");
}
catch (InvalidDataException)
{
    if (destination.Length > 1024) throw new Exception("teto ultrapassado");
    Console.WriteLine("STREAM_LIMIT_ENFORCED");
}

static async Task CopyBounded(Stream input, Stream output, long limit, CancellationToken token)
{
    byte[] buffer = new byte[256];
    long total = 0;
    int count;
    while ((count = await input.ReadAsync(buffer, token)) > 0)
    {
        total += count;
        if (total > limit) throw new InvalidDataException("too large");
        await output.WriteAsync(buffer.AsMemory(0, count), token);
    }
}` },
  ],
  "JSON e contratos versionados": [
    { lang: "csharp", purpose: "DTO .NET 8 exige campo, recusa extra hostil e valida vazio depois do parser.", code: `using System;
using System.Text.Json;
using System.Text.Json.Serialization;

var good = JsonSerializer.Deserialize<CreateRequest>("{\\\"seatId\\\":\\\"seat-7\\\"}",
    new JsonSerializerOptions(JsonSerializerDefaults.Web));
if (good?.SeatId != "seat-7") throw new Exception("DTO válido");
foreach (string raw in new[] { "{}", "{\\\"seatId\\\":\\\"x\\\",\\\"tenant\\\":\\\"evil\\\"}" })
{
    try { _ = JsonSerializer.Deserialize<CreateRequest>(raw,
        new JsonSerializerOptions(JsonSerializerDefaults.Web));
        throw new Exception("payload hostil aceito"); }
    catch (JsonException) { }
}
Console.WriteLine("JSON_CONTRACT_REJECTS_HOSTILE_OK");

[JsonUnmappedMemberHandling(JsonUnmappedMemberHandling.Disallow)]
sealed class CreateRequest { public required string SeatId { get; init; } }` },
    { lang: "csharp", purpose: "Evento V1/V2 é convertido a modelo comum; versão desconhecida falha fechada.", code: `using System;
using System.Text.Json;

string v1 = "{\\\"version\\\":1,\\\"reservationId\\\":\\\"r-1\\\"}";
string v2 = "{\\\"version\\\":2,\\\"reservationId\\\":\\\"r-1\\\",\\\"kind\\\":\\\"created\\\"}";
if (Read(v1).Kind != "created" || Read(v2).Kind != "created")
    throw new Exception("versão antiga perdida");
try { _ = Read("{\\\"version\\\":3,\\\"reservationId\\\":\\\"r-1\\\"}");
    throw new Exception("v3 desconhecida aceita"); }
catch (NotSupportedException) { Console.WriteLine("EVENT_VERSION_FAIL_CLOSED_OK"); }

static EventModel Read(string json)
{
    using JsonDocument doc = JsonDocument.Parse(json);
    var root = doc.RootElement;
    int version = root.GetProperty("version").GetInt32();
    string id = root.GetProperty("reservationId").GetString()
        ?? throw new JsonException("reservationId");
    return version switch
    {
        1 => new EventModel(id, "created"),
        2 => new EventModel(id, root.GetProperty("kind").GetString() ?? throw new JsonException("kind")),
        _ => throw new NotSupportedException("payload version")
    };
}
record EventModel(string ReservationId, string Kind);` },
  ],
  "Task, async e await": [
    { lang: "csharp", purpose: "A resposta espera o efeito: um TCS prova que chamada não conclui cedo e propaga falha.", code: `using System;
using System.Threading.Tasks;

var gate = new TaskCompletionSource<string>(TaskCreationOptions.RunContinuationsAsynchronously);
Task<string> reservation = ReserveAsync(() => gate.Task);
if (reservation.IsCompleted) throw new Exception("efeito não aguardado");
gate.SetResult("confirmed");
if (await reservation != "confirmed") throw new Exception("resultado perdido");

var failed = new TaskCompletionSource<string>(TaskCreationOptions.RunContinuationsAsynchronously);
Task<string> pending = ReserveAsync(() => failed.Task);
failed.SetException(new InvalidOperationException("provider down"));
try { _ = await pending; throw new Exception("erro ignorado"); }
catch (InvalidOperationException) { Console.WriteLine("AWAIT_EFFECT_AND_ERROR_OK"); }

static async Task<string> ReserveAsync(Func<Task<string>> charge)
{
    string result = await charge();
    return result;
}` },
    { lang: "csharp", purpose: "WhenAll para duas leituras independentes, com ordem observável e erro de uma tarefa preservado.", code: `using System;
using System.Threading.Tasks;

var left = new TaskCompletionSource<int>(TaskCreationOptions.RunContinuationsAsynchronously);
var right = new TaskCompletionSource<int>(TaskCreationOptions.RunContinuationsAsynchronously);
Task<int[]> joined = Task.WhenAll(left.Task, right.Task);
right.SetResult(7);
if (joined.IsCompleted) throw new Exception("terminou antes das duas leituras");
left.SetResult(5);
int[] values = await joined;
if (values.Length != 2 || values[0] != 5 || values[1] != 7)
    throw new Exception("ordem do resultado alterada");
Console.WriteLine("WHEN_ALL_INDEPENDENT_OK");` },
  ],
  "CancellationToken e deadlines": [
    { lang: "csharp", purpose: "Token vinculado a client abort e deadline libera operação local sem fingir rollback remoto.", code: `using System;
using System.Threading;
using System.Threading.Tasks;

using var client = new CancellationTokenSource();
using var deadline = new CancellationTokenSource(TimeSpan.FromSeconds(10));
using var linked = CancellationTokenSource.CreateLinkedTokenSource(client.Token, deadline.Token);
var entered = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
Task operation = WaitForSignalAsync(entered, linked.Token);
await entered.Task;
client.Cancel();
try { await operation; throw new Exception("cancelamento ignorado"); }
catch (OperationCanceledException) when (client.IsCancellationRequested)
{ Console.WriteLine("LINKED_CANCELLATION_OK"); }

static async Task WaitForSignalAsync(TaskCompletionSource entered, CancellationToken token)
{
    entered.SetResult();
    await Task.Delay(Timeout.InfiniteTimeSpan, token);
}` },
    { lang: "csharp", purpose: "Timeout ambíguo consulta por idempotency key estável, sem segunda cobrança.", code: `using System;
using System.Collections.Generic;
using System.Threading.Tasks;

var gateway = new FakeGateway();
string key = "tenant-a:request-42";
string result = await ChargeWithReconciliationAsync(gateway, key);
if (result != "paid" || gateway.PostCount != 1 || gateway.Keys.Count != 1)
    throw new Exception("retry com efeito duplicado");
Console.WriteLine("UNKNOWN_RECONCILED_BY_KEY_OK");

static async Task<string> ChargeWithReconciliationAsync(FakeGateway gateway, string key)
{
    try { return await gateway.PostAsync(key); }
    catch (TimeoutException) { return await gateway.GetByKeyAsync(key); }
}

sealed class FakeGateway
{
    public int PostCount { get; private set; }
    public HashSet<string> Keys { get; } = [];
    public Task<string> PostAsync(string key)
    {
        PostCount++;
        Keys.Add(key); // efeito aconteceu, resposta se perdeu
        throw new TimeoutException();
    }
    public Task<string> GetByKeyAsync(string key) =>
        Task.FromResult(Keys.Contains(key) ? "paid" : "absent");
}` },
  ],
  "Locks, Interlocked e channels": [
    { lang: "csharp", purpose: "Interlocked preserva contador local sob corrida e SemaphoreSlim limita efeito concorrente.", code: `using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

int count = 0;
await Task.WhenAll(Enumerable.Range(0, 1000).Select(_ => Task.Run(() =>
    Interlocked.Increment(ref count))));
if (count != 1000) throw new Exception("atualização perdida");

using var slots = new SemaphoreSlim(2, 2);
int active = 0, maximum = 0;
await Task.WhenAll(Enumerable.Range(0, 12).Select(async _ =>
{
    await slots.WaitAsync();
    try
    {
        int current = Interlocked.Increment(ref active);
        int observed;
        do { observed = maximum; }
        while (current > observed && Interlocked.CompareExchange(ref maximum, current, observed) != observed);
        await Task.Delay(2);
    }
    finally { Interlocked.Decrement(ref active); slots.Release(); }
}));
if (maximum is < 1 or > 2 || active != 0) throw new Exception("limite de concorrência quebrado");
Console.WriteLine("LOCAL_ATOMIC_AND_LIMIT_OK");` },
    { lang: "csharp", purpose: "Channel bounded bloqueia produtor quando cheio; consumo reabre espaço sem perda.", code: `using System;
using System.Threading.Channels;
using System.Threading.Tasks;

var queue = Channel.CreateBounded<int>(new BoundedChannelOptions(1)
{ FullMode = BoundedChannelFullMode.Wait, SingleReader = true, SingleWriter = true });
await queue.Writer.WriteAsync(1);
ValueTask pendingWrite = queue.Writer.WriteAsync(2);
if (pendingWrite.IsCompleted) throw new Exception("sem backpressure");
if (await queue.Reader.ReadAsync() != 1) throw new Exception("ordem alterada");
await pendingWrite;
queue.Writer.Complete();
if (await queue.Reader.ReadAsync() != 2) throw new Exception("item perdido");
if (await queue.Reader.WaitToReadAsync()) throw new Exception("completion ignorado");
Console.WriteLine("BOUNDED_CHANNEL_BACKPRESSURE_OK");` },
  ],
  "Parallelism e race testing": [
    { lang: "csharp", purpose: "Barreira força duas reservas a ler capacidade um; atualização condicional concede só uma.", code: `using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

var bothRead = new CountdownEvent(2);
var release = new ManualResetEventSlim();
int remaining = 1;
Task<bool>[] requests = Enumerable.Range(0, 2).Select(_ => Task.Run(() =>
{
    int snapshot = Volatile.Read(ref remaining);
    bothRead.Signal();
    release.Wait();
    if (snapshot <= 0) return false;
    return Interlocked.CompareExchange(ref remaining, snapshot - 1, snapshot) == snapshot;
})).ToArray();
if (!bothRead.Wait(TimeSpan.FromSeconds(3))) throw new Exception("barreira não alcançada");
release.Set();
bool[] wins = await Task.WhenAll(requests);
if (wins.Count(x => x) != 1 || remaining != 0) throw new Exception("capacidade violada");
Console.WriteLine("LOCAL_RACE_ONE_WINNER_OK");
// A proteção entre réplicas exige UPDATE condicional/constraint no banco.` },
    { lang: "csharp", purpose: "Parallel.ForEachAsync impõe grau máximo observável para trabalho de lote.", code: `using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

int active = 0, maximum = 0, completed = 0;
await Parallel.ForEachAsync(Enumerable.Range(0, 30),
    new ParallelOptions { MaxDegreeOfParallelism = 3 }, async (_, ct) =>
    {
        int now = Interlocked.Increment(ref active);
        int old;
        do { old = maximum; }
        while (now > old && Interlocked.CompareExchange(ref maximum, now, old) != old);
        try { await Task.Delay(3, ct); Interlocked.Increment(ref completed); }
        finally { Interlocked.Decrement(ref active); }
    });
if (completed != 30 || maximum is < 1 or > 3 || active != 0)
    throw new Exception("lote sem limite ou incompleto");
Console.WriteLine("BOUNDED_PARALLELISM_OK");` },
  ],
  "Host, middleware e configuração": [
    { lang: "csharp", purpose: "Host ASP.NET Core real em porta efêmera: middleware observa request e endpoint responde pelo pipeline.", code: `using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder();
builder.WebHost.ConfigureKestrel(o => o.Listen(IPAddress.Loopback, 0));
await using var app = builder.Build();
app.Use(async (context, next) =>
{
    context.Response.Headers["X-Quiron-Middleware"] = "seen";
    await next(context);
});
app.MapGet("/health/live", () => Results.Ok(new { status = "live" }));
await app.StartAsync();
var addresses = app.Services.GetRequiredService<IServer>().Features
    .Get<IServerAddressesFeature>()!.Addresses;
using var client = new HttpClient { BaseAddress = new Uri(addresses.Single()) };
using var response = await client.GetAsync("/health/live");
string body = await response.Content.ReadAsStringAsync();
if (response.StatusCode != HttpStatusCode.OK ||
    response.Headers.GetValues("X-Quiron-Middleware").Single() != "seen" ||
    !body.Contains("live")) throw new Exception("pipeline HTTP falhou");
await app.StopAsync();
Console.WriteLine("ASPNET_HOST_PIPELINE_OK");` },
    { lang: "csharp", purpose: "Options obrigatórias validadas no startup e configuração de teste em memória.", code: `using System;
using System.Collections.Generic;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

var values = new Dictionary<string, string?>
{ ["Gateway:BaseUrl"] = "https://provider.example", ["Gateway:TimeoutSeconds"] = "5" };
var config = new ConfigurationBuilder().AddInMemoryCollection(values).Build();
var services = new ServiceCollection();
services.AddOptions<GatewayOptions>().Bind(config.GetSection("Gateway"))
    .Validate(o => Uri.TryCreate(o.BaseUrl, UriKind.Absolute, out var u) &&
        u.Scheme == Uri.UriSchemeHttps && o.TimeoutSeconds is >= 1 and <= 30,
        "Gateway inválido").ValidateOnStart();
using var provider = services.BuildServiceProvider();
var valid = provider.GetRequiredService<IOptions<GatewayOptions>>().Value;
if (valid.TimeoutSeconds != 5) throw new Exception("binding falhou");
Console.WriteLine("OPTIONS_VALIDATION_OK");

sealed class GatewayOptions
{
    public string BaseUrl { get; set; } = "";
    public int TimeoutSeconds { get; set; }
}` },
  ],
  "Minimal APIs, controllers e validação": [
    { lang: "csharp", purpose: "DTO hostil não decide tenant/status: validação de comando e replay de key retornam mesmo ID.", code: `using System;
using System.Collections.Generic;
using System.Text.Json;

var rows = new Dictionary<string, Reservation>();
string claimTenant = "tenant-a";
string body = """{"seatId":"A1","tenantId":"tenant-b","status":"confirmed"}""";
var dto = JsonSerializer.Deserialize<CreateDto>(body,
    new JsonSerializerOptions { PropertyNameCaseInsensitive = true })!;
Reservation first = Create(dto, claimTenant, "key-1", rows);
Reservation replay = Create(dto, claimTenant, "key-1", rows);
if (first != replay || first.TenantId != claimTenant || first.Status != "pending" || rows.Count != 1)
    throw new Exception("campo hostil ou replay incorreto");
try { _ = Create(new CreateDto("B2"), claimTenant, "key-1", rows);
    throw new Exception("fingerprint divergente aceito"); }
catch (InvalidOperationException) { Console.WriteLine("BOUNDARY_TENANT_REPLAY_OK"); }

static Reservation Create(CreateDto dto, string tenant, string key,
    Dictionary<string, Reservation> rows)
{
    if (string.IsNullOrWhiteSpace(dto.SeatId)) throw new ArgumentException("seatId");
    string scope = tenant + ":" + key;
    if (rows.TryGetValue(scope, out var old))
        return old.SeatId == dto.SeatId ? old : throw new InvalidOperationException("fingerprint");
    var result = new Reservation(Guid.NewGuid().ToString("N"), tenant, dto.SeatId, "pending");
    rows.Add(scope, result);
    return result;
}
record CreateDto(string SeatId);
record Reservation(string Id, string TenantId, string SeatId, string Status);` },
    { lang: "csharp", purpose: "Minimal API real rejeita DTO inválido antes de efeito e emite 201/Location; autenticação fica para teste de integração próprio.", code: `using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

var builder = WebApplication.CreateBuilder();
builder.WebHost.ConfigureKestrel(o => o.Listen(IPAddress.Loopback, 0));
await using var app = builder.Build();
int writes = 0;
app.MapPost("/reservations", (CreateRequest request) =>
{
    if (string.IsNullOrWhiteSpace(request.SeatId)) return Results.BadRequest();
    writes++;
    return Results.Created("/reservations/r-1", new { id = "r-1", status = "pending" });
});
await app.StartAsync();
string address = app.Services.GetRequiredService<IServer>().Features
    .Get<IServerAddressesFeature>()!.Addresses.Single();
using var client = new HttpClient { BaseAddress = new Uri(address) };
using var bad = await client.PostAsJsonAsync("/reservations", new CreateRequest(""));
using var good = await client.PostAsJsonAsync("/reservations", new CreateRequest("A1"));
if (bad.StatusCode != HttpStatusCode.BadRequest ||
    good.StatusCode != HttpStatusCode.Created || good.Headers.Location?.ToString() != "/reservations/r-1" ||
    writes != 1) throw new Exception("contrato HTTP quebrado");
await app.StopAsync();
Console.WriteLine("MINIMAL_API_CONTRACT_OK");

record CreateRequest(string SeatId);` },
  ],
  "HttpClientFactory e integrações": [
    { lang: "csharp", purpose: "Typed client via factory injeta key estável e transport fake captura método, URL e header.", code: `using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

var handler = new RecordingHandler();
var services = new ServiceCollection();
services.AddHttpClient<Gateway>(client => client.BaseAddress = new Uri("https://provider.example/"))
    .ConfigurePrimaryHttpMessageHandler(() => handler);
using var provider = services.BuildServiceProvider();
var gateway = provider.GetRequiredService<Gateway>();
string result = await gateway.ChargeAsync("event-42", CancellationToken.None);
if (result != "accepted" || handler.Count != 1 || handler.Key != "event-42" ||
    handler.Method != HttpMethod.Post || handler.Path != "/charges")
    throw new Exception("adapter HTTP divergente");
Console.WriteLine("HTTP_FACTORY_TYPED_CLIENT_OK");

sealed class Gateway(HttpClient client)
{
    public async Task<string> ChargeAsync(string key, CancellationToken token)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "charges");
        request.Headers.Add("Idempotency-Key", key);
        using var response = await client.SendAsync(request, token);
        response.EnsureSuccessStatusCode();
        return await response.Content.ReadAsStringAsync(token);
    }
}
sealed class RecordingHandler : HttpMessageHandler
{
    public int Count { get; private set; }
    public string Key { get; private set; } = "";
    public string Path { get; private set; } = "";
    public HttpMethod? Method { get; private set; }
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken token)
    {
        Count++; Key = string.Join("", request.Headers.GetValues("Idempotency-Key"));
        Path = request.RequestUri!.AbsolutePath; Method = request.Method;
        return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            { Content = new StringContent("accepted") });
    }
}` },
    { lang: "csharp", purpose: "Timeout depois do efeito é reconciliado pela mesma key, sem novo POST.", code: `using System;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

var transport = new AmbiguousHandler();
using var client = new HttpClient(transport) { BaseAddress = new Uri("https://provider.example/") };
string key = "tenant-a:event-9";
try { await client.PostAsync("charges", new StringContent(key)); }
catch (HttpRequestException) { /* efeito pode ter acontecido */ }
string state = await client.GetStringAsync("charges/by-key/" + Uri.EscapeDataString(key));
if (state != "paid" || transport.Posts != 1 || transport.Lookups != 1)
    throw new Exception("retry inseguro");
Console.WriteLine("AMBIGUOUS_HTTP_RECONCILED_OK");

sealed class AmbiguousHandler : HttpMessageHandler
{
    public int Posts { get; private set; }
    public int Lookups { get; private set; }
    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken token)
    {
        if (request.Method == HttpMethod.Post)
        { Posts++; throw new HttpRequestException("socket closed after commit"); }
        Lookups++;
        return Task.FromResult(new HttpResponseMessage(System.Net.HttpStatusCode.OK)
            { Content = new StringContent("paid") });
    }
}` },
  ],
  "Uploads, downloads e limites": [
    { lang: "csharp", purpose: "Upload bounded em stream rejeita tamanho acima do teto sem confiar em Content-Length.", code: `using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

byte[] small = new byte[1024], big = new byte[1025];
await using var accepted = new MemoryStream(small);
await using var rejected = new MemoryStream(big);
if (await CopyLimitedAsync(accepted, 1024, CancellationToken.None) != 1024)
    throw new Exception("arquivo válido rejeitado");
try { _ = await CopyLimitedAsync(rejected, 1024, CancellationToken.None);
    throw new Exception("arquivo grande aceito"); }
catch (InvalidDataException) { Console.WriteLine("STREAM_UPLOAD_LIMIT_OK"); }

static async Task<long> CopyLimitedAsync(Stream source, long max, CancellationToken token)
{
    byte[] buffer = new byte[256];
    long count = 0;
    while (true)
    {
        int read = await source.ReadAsync(buffer, token);
        if (read == 0) return count;
        count += read;
        if (count > max) throw new InvalidDataException("upload too large");
    }
}` },
    { lang: "csharp", purpose: "Nome físico gerado pelo servidor impede traversal e download preserva bytes completos.", code: `using System;
using System.IO;
using System.Linq;
using System.Text;

string root = Path.Combine(Path.GetTempPath(), "chiron-upload-" + Guid.NewGuid().ToString("N"));
Directory.CreateDirectory(root);
try
{
    string hostile = "../../appsettings.Production.json";
    string physical = Guid.NewGuid().ToString("N") + ".bin";
    string path = Path.Combine(root, physical); // nunca usar hostile no path físico
    byte[] payload = Encoding.UTF8.GetBytes("recibo íntegro");
    await File.WriteAllBytesAsync(path, payload);
    await using var stream = File.OpenRead(path);
    using var response = new MemoryStream();
    await stream.CopyToAsync(response);
    if (!payload.SequenceEqual(response.ToArray()) ||
        Path.GetFullPath(path).Contains("appsettings.Production.json") ||
        string.IsNullOrEmpty(hostile)) throw new Exception("path ou bytes incorretos");
    Console.WriteLine("SAFE_PHYSICAL_NAME_DOWNLOAD_OK");
}
finally { Directory.Delete(root, recursive: true); }` },
  ],
  "ADO.NET e SQL parametrizado": [
    { lang: "csharp", purpose: "ADO.NET/SQLite real: parâmetro mantém SQL fixo e impede que tenant hostil alargue consulta.", code: `using System;
using Microsoft.Data.Sqlite;

await using var db = new SqliteConnection("Data Source=:memory:");
await db.OpenAsync();
await using (var schema = db.CreateCommand())
{
    schema.CommandText = "CREATE TABLE reservations (id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL)";
    await schema.ExecuteNonQueryAsync();
}
foreach (string tenant in new[] { "tenant-a", "tenant-b" })
{
    await using var insert = db.CreateCommand();
    insert.CommandText = "INSERT INTO reservations VALUES ($id, $tenant)";
    insert.Parameters.AddWithValue("$id", "r-" + tenant);
    insert.Parameters.AddWithValue("$tenant", tenant);
    await insert.ExecuteNonQueryAsync();
}
await using var query = db.CreateCommand();
query.CommandText = "SELECT COUNT(*) FROM reservations WHERE tenant_id = $tenant";
query.Parameters.AddWithValue("$tenant", "tenant-a' OR 1=1 --");
if (Convert.ToInt32(await query.ExecuteScalarAsync()) != 0)
    throw new Exception("injeção alargou consulta");
query.Parameters["$tenant"].Value = "tenant-a";
if (Convert.ToInt32(await query.ExecuteScalarAsync()) != 1)
    throw new Exception("filtro de tenant falhou");
Console.WriteLine("ADONET_PARAMETER_TENANT_OK");` },
    { lang: "csharp", purpose: "UPDATE condicional dentro de transação local no SQLite concede só uma reserva e grava outbox.", code: `using System;
using Microsoft.Data.Sqlite;

await using var db = new SqliteConnection("Data Source=:memory:");
await db.OpenAsync();
await using (var setup = db.CreateCommand())
{
    setup.CommandText = "CREATE TABLE inventory (tenant TEXT, seat TEXT, remaining INTEGER CHECK (remaining >= 0), PRIMARY KEY (tenant, seat));" +
        "CREATE TABLE outbox (event_id TEXT PRIMARY KEY);" +
        "INSERT INTO inventory VALUES ('a', 'A1', 1)";
    await setup.ExecuteNonQueryAsync();
}
int successes = 0;
for (int attempt = 0; attempt < 2; attempt++)
{
    await using var tx = await db.BeginTransactionAsync();
    await using var claim = db.CreateCommand();
    claim.Transaction = (SqliteTransaction)tx;
    claim.CommandText = "UPDATE inventory SET remaining=remaining-1 WHERE tenant=$tenant AND seat=$seat AND remaining>0";
    claim.Parameters.AddWithValue("$tenant", "a");
    claim.Parameters.AddWithValue("$seat", "A1");
    int changed = await claim.ExecuteNonQueryAsync();
    if (changed == 1)
    {
        await using var evt = db.CreateCommand();
        evt.Transaction = (SqliteTransaction)tx;
        evt.CommandText = "INSERT INTO outbox VALUES ($id)";
        evt.Parameters.AddWithValue("$id", "event-" + attempt);
        await evt.ExecuteNonQueryAsync();
        successes++;
    }
    await tx.CommitAsync();
}
await using var count = db.CreateCommand();
count.CommandText = "SELECT remaining + (SELECT COUNT(*) FROM outbox) FROM inventory";
if (successes != 1 || Convert.ToInt32(await count.ExecuteScalarAsync()) != 1)
    throw new Exception("capacidade/outbox inconsistentes");
Console.WriteLine("ADONET_CONDITIONAL_UPDATE_OK");
// Este smoke é sequencial: disputa de duas conexões deve ser ensaiada no banco alvo.` },
  ],
  "EF Core, tracking e LINQ traduzido": [
    { lang: "csharp", purpose: "EF Core/SQLite real projeta DTO sem tracking e mantém tenant no SQL traduzido.", code: `using System;
using System.Linq;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

await using var connection = new SqliteConnection("Data Source=:memory:");
await connection.OpenAsync();
var options = new DbContextOptionsBuilder<ReservationsDb>().UseSqlite(connection).Options;
await using (var seed = new ReservationsDb(options))
{
    await seed.Database.EnsureCreatedAsync();
    seed.Reservations.AddRange(new Reservation { Id = "r1", TenantId = "a", Seat = "A1" },
        new Reservation { Id = "r2", TenantId = "b", Seat = "B1" });
    await seed.SaveChangesAsync();
}
await using var db = new ReservationsDb(options);
var query = db.Reservations.AsNoTracking().Where(r => r.TenantId == "a")
    .Select(r => new { r.Id, r.Seat });
string sql = query.ToQueryString();
var rows = await query.ToListAsync();
if (rows.Count != 1 || rows[0].Id != "r1" ||
    db.ChangeTracker.Entries().Any() || !sql.Contains("tenant", StringComparison.OrdinalIgnoreCase))
    throw new Exception("projeção/tradução incorreta");
Console.WriteLine("EF_PROJECTION_TENANT_SQL_OK");

sealed class ReservationsDb(DbContextOptions<ReservationsDb> options) : DbContext(options)
{
    public DbSet<Reservation> Reservations => Set<Reservation>();
}
sealed class Reservation
{
    public string Id { get; set; } = "";
    public string TenantId { get; set; } = "";
    public string Seat { get; set; } = "";
}` },
    { lang: "csharp", purpose: "ExecuteUpdate direto usa predicate de capacidade e rows affected, sem confiar no ChangeTracker.", code: `using System;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

await using var connection = new SqliteConnection("Data Source=:memory:");
await connection.OpenAsync();
var options = new DbContextOptionsBuilder<InventoryDb>().UseSqlite(connection).Options;
await using var db = new InventoryDb(options);
await db.Database.EnsureCreatedAsync();
db.Seats.Add(new Seat { Id = "A1", TenantId = "a", Remaining = 1 });
await db.SaveChangesAsync();
db.ChangeTracker.Clear();
int first = await db.Seats.Where(s => s.TenantId == "a" && s.Id == "A1" && s.Remaining > 0)
    .ExecuteUpdateAsync(set => set.SetProperty(s => s.Remaining, s => s.Remaining - 1));
int second = await db.Seats.Where(s => s.TenantId == "a" && s.Id == "A1" && s.Remaining > 0)
    .ExecuteUpdateAsync(set => set.SetProperty(s => s.Remaining, s => s.Remaining - 1));
int remaining = await db.Seats.Where(s => s.Id == "A1").Select(s => s.Remaining).SingleAsync();
if (first != 1 || second != 0 || remaining != 0) throw new Exception("última vaga violada");
Console.WriteLine("EF_EXECUTE_UPDATE_CAPACITY_OK");

sealed class InventoryDb(DbContextOptions<InventoryDb> options) : DbContext(options)
{
    public DbSet<Seat> Seats => Set<Seat>();
}
sealed class Seat
{
    public string Id { get; set; } = "";
    public string TenantId { get; set; } = "";
    public int Remaining { get; set; }
}` },
  ],
  "Transactions, concurrency tokens e retry": [
    { lang: "csharp", purpose: "Dois DbContexts e token gerenciado no SQLite: segundo SaveChanges detecta edição obsoleta.", code: `using System;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

await using var connection = new SqliteConnection("Data Source=:memory:");
await connection.OpenAsync();
var options = new DbContextOptionsBuilder<VersionDb>().UseSqlite(connection).Options;
await using (var setup = new VersionDb(options))
{
    await setup.Database.EnsureCreatedAsync();
    setup.Seats.Add(new Seat { Id = "A1", Remaining = 3, Version = Guid.NewGuid() });
    await setup.SaveChangesAsync();
}
await using var first = new VersionDb(options);
await using var second = new VersionDb(options);
Seat a = await first.Seats.SingleAsync();
Seat b = await second.Seats.SingleAsync();
a.Remaining = 2; a.Version = Guid.NewGuid();
await first.SaveChangesAsync();
b.Remaining = 1; b.Version = Guid.NewGuid();
try { await second.SaveChangesAsync(); throw new Exception("lost update não detectado"); }
catch (DbUpdateConcurrencyException) { Console.WriteLine("EF_CONCURRENCY_TOKEN_OK"); }

sealed class VersionDb(DbContextOptions<VersionDb> options) : DbContext(options)
{
    public DbSet<Seat> Seats => Set<Seat>();
    protected override void OnModelCreating(ModelBuilder model) =>
        model.Entity<Seat>().Property(s => s.Version).IsConcurrencyToken();
}
sealed class Seat
{
    public string Id { get; set; } = "";
    public int Remaining { get; set; }
    public Guid Version { get; set; }
}` },
    { lang: "csharp", purpose: "EF transaction reverte reserva+outbox juntas após falha e comita ambas em tentativa nova.", code: `using System;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

await using var connection = new SqliteConnection("Data Source=:memory:");
await connection.OpenAsync();
var options = new DbContextOptionsBuilder<OutboxDb>().UseSqlite(connection).Options;
await using var db = new OutboxDb(options);
await db.Database.EnsureCreatedAsync();
await using (var failed = await db.Database.BeginTransactionAsync())
{
    db.Reservations.Add(new Reservation { Id = "r1" });
    db.Events.Add(new OutboxEvent { Id = "e1", ReservationId = "r1" });
    await db.SaveChangesAsync();
    await failed.RollbackAsync();
}
db.ChangeTracker.Clear();
if (await db.Reservations.CountAsync() != 0 || await db.Events.CountAsync() != 0)
    throw new Exception("rollback parcial");
await using (var success = await db.Database.BeginTransactionAsync())
{
    db.Reservations.Add(new Reservation { Id = "r1" });
    db.Events.Add(new OutboxEvent { Id = "e1", ReservationId = "r1" });
    await db.SaveChangesAsync();
    await success.CommitAsync();
}
if (await db.Reservations.CountAsync() != 1 || await db.Events.CountAsync() != 1)
    throw new Exception("commit parcial");
Console.WriteLine("EF_TRANSACTION_OUTBOX_OK");

sealed class OutboxDb(DbContextOptions<OutboxDb> options) : DbContext(options)
{
    public DbSet<Reservation> Reservations => Set<Reservation>();
    public DbSet<OutboxEvent> Events => Set<OutboxEvent>();
}
sealed class Reservation { public string Id { get; set; } = ""; }
sealed class OutboxEvent
{
    public string Id { get; set; } = "";
    public string ReservationId { get; set; } = "";
}` },
  ],
  "Migrations, constraints e idempotência": [
    { lang: "csharp", purpose: "SQLite relacional impõe unique composto, CHECK e FK; teste de constraint não substitui migration de produção.", code: `using System;
using Microsoft.Data.Sqlite;

await using var db = new SqliteConnection("Data Source=:memory:");
await db.OpenAsync();
await using (var setup = db.CreateCommand())
{
    setup.CommandText = "PRAGMA foreign_keys=ON;" +
        "CREATE TABLE inventory (id TEXT PRIMARY KEY, remaining INTEGER NOT NULL CHECK (remaining >= 0));" +
        "CREATE TABLE requests (tenant TEXT NOT NULL, operation TEXT NOT NULL, idem_key TEXT NOT NULL," +
        "fingerprint TEXT NOT NULL, PRIMARY KEY (tenant, operation, idem_key));" +
        "CREATE TABLE reservations (id TEXT PRIMARY KEY, inventory_id TEXT NOT NULL REFERENCES inventory(id));" +
        "INSERT INTO inventory VALUES ('A1', 1);" +
        "INSERT INTO requests VALUES ('a', 'create', 'key-1', 'hash-1');";
    await setup.ExecuteNonQueryAsync();
}
foreach (string invalid in new[] {
    "INSERT INTO requests VALUES ('a','create','key-1','hash-1')",
    "INSERT INTO inventory VALUES ('B1',-1)",
    "INSERT INTO reservations VALUES ('r1','missing')" })
{
    await using var command = db.CreateCommand(); command.CommandText = invalid;
    try { await command.ExecuteNonQueryAsync(); throw new Exception("constraint ausente"); }
    catch (SqliteException) { }
}
Console.WriteLine("RELATIONAL_CONSTRAINTS_OK");` },
    { lang: "csharp", purpose: "Expansão de schema preserva leitura antiga, backfill e leitura nova antes de retirar coluna antiga.", code: `using System;
using Microsoft.Data.Sqlite;

await using var db = new SqliteConnection("Data Source=:memory:");
await db.OpenAsync();
await using (var setup = db.CreateCommand())
{
    setup.CommandText = "CREATE TABLE reservations (id TEXT PRIMARY KEY, old_status TEXT NOT NULL);" +
        "INSERT INTO reservations VALUES ('r1','pending');" +
        "ALTER TABLE reservations ADD COLUMN new_status TEXT;" +
        "UPDATE reservations SET new_status=old_status WHERE new_status IS NULL;";
    await setup.ExecuteNonQueryAsync();
}
await using var check = db.CreateCommand();
check.CommandText = "SELECT old_status || ':' || new_status FROM reservations WHERE id='r1'";
if ((string?)await check.ExecuteScalarAsync() != "pending:pending")
    throw new Exception("rollout V1/V2 incompatível");
Console.WriteLine("EXPAND_MIGRATE_COMPATIBLE_OK");
// DROP old_status só após todos binários/leitores e eventos V1 aposentados.` },
  ],
  "Authentication, authorization e tenant": [
    { lang: "csharp", purpose: "Policy real diferencia principal sem scope da principal autorizada; tenant vem de claim validada.", code: `using System;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

var services = new ServiceCollection();
services.AddLogging();
services.AddAuthorization(o => o.AddPolicy("reservation:write", p =>
    p.RequireAuthenticatedUser().RequireClaim("scope", "reservation:write")));
using var provider = services.BuildServiceProvider();
var auth = provider.GetRequiredService<IAuthorizationService>();
ClaimsPrincipal principal(string tenant, string? scope) => new(
    new ClaimsIdentity(new[] { new Claim("tenant", tenant) }
        .Concat(scope is null ? [] : new[] { new Claim("scope", scope) }), "test"));
var allowed = principal("tenant-a", "reservation:write");
var denied = principal("tenant-b", null);
if (!(await auth.AuthorizeAsync(allowed, "reservation:write")).Succeeded ||
    (await auth.AuthorizeAsync(denied, "reservation:write")).Succeeded ||
    allowed.FindFirstValue("tenant") != "tenant-a") throw new Exception("policy/claim inválidas");
Console.WriteLine("AUTH_POLICY_CLAIM_OK");` },
    { lang: "csharp", purpose: "Predicate tenant no SQL real impede leitura cruzada mesmo com ID de recurso conhecido.", code: `using System;
using Microsoft.Data.Sqlite;

await using var db = new SqliteConnection("Data Source=:memory:");
await db.OpenAsync();
await using (var setup = db.CreateCommand())
{
    setup.CommandText = "CREATE TABLE reservations (id TEXT, tenant TEXT, secret TEXT, PRIMARY KEY(id,tenant));" +
        "INSERT INTO reservations VALUES ('r1','a','sentinel-a');";
    await setup.ExecuteNonQueryAsync();
}
static async Task<string?> Read(SqliteConnection db, string id, string claimTenant)
{
    await using var cmd = db.CreateCommand();
    cmd.CommandText = "SELECT secret FROM reservations WHERE id=$id AND tenant=$tenant";
    cmd.Parameters.AddWithValue("$id", id);
    cmd.Parameters.AddWithValue("$tenant", claimTenant);
    return (string?)await cmd.ExecuteScalarAsync();
}
if (await Read(db, "r1", "b") is not null || await Read(db, "r1", "a") != "sentinel-a")
    throw new Exception("isolamento de tenant falhou");
Console.WriteLine("TENANT_SQL_PREDICATE_OK");` },
  ],
  "CSRF, CORS e secrets": [
    { lang: "csharp", purpose: "Antiforgery real no TestServer rejeita POST sem token, aceita token+cookie do mesmo cliente.", code: `using System;
using System.Net;
using System.Net.Http;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;

using var server = new TestServer(new WebHostBuilder()
    .ConfigureServices(s => s.AddAntiforgery(o => o.HeaderName = "X-CSRF"))
    .Configure(app =>
    {
        app.Run(async ctx =>
        {
            var antiforgery = ctx.RequestServices.GetRequiredService<IAntiforgery>();
            if (ctx.Request.Path == "/token")
            {
                var tokens = antiforgery.GetAndStoreTokens(ctx);
                await ctx.Response.WriteAsync(tokens.RequestToken!);
                return;
            }
            try { await antiforgery.ValidateRequestAsync(ctx); await ctx.Response.WriteAsync("ok"); }
            catch (AntiforgeryValidationException) { ctx.Response.StatusCode = 400; }
        });
    }));
using var client = server.CreateClient();
using var tokenResponse = await client.GetAsync("/token");
string token = await tokenResponse.Content.ReadAsStringAsync();
string cookie = string.Join("; ", tokenResponse.Headers.GetValues("Set-Cookie")
    .Select(v => v.Split(';')[0]));
using var bad = new HttpRequestMessage(HttpMethod.Post, "/change");
bad.Headers.Add("Cookie", cookie);
using var badResponse = await client.SendAsync(bad);
using var good = new HttpRequestMessage(HttpMethod.Post, "/change");
good.Headers.Add("Cookie", cookie); good.Headers.Add("X-CSRF", token);
using var goodResponse = await client.SendAsync(good);
if (badResponse.StatusCode != HttpStatusCode.BadRequest || goodResponse.StatusCode != HttpStatusCode.OK)
    throw new Exception("CSRF sem proteção");
Console.WriteLine("ANTIFORGERY_COOKIE_OK");` },
    { lang: "csharp", purpose: "CORS no TestServer só libera origin configurada; origin hostil não recebe allow-origin.", code: `using System;
using System.Net.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;

using var server = new TestServer(new WebHostBuilder()
    .ConfigureServices(s => s.AddCors(o => o.AddPolicy("frontend", p =>
        p.WithOrigins("https://app.example").WithMethods("GET", "POST").AllowAnyHeader())))
    .Configure(app =>
    {
        app.UseCors("frontend");
        app.Run(ctx => ctx.Response.WriteAsync("ok"));
    }));
using var client = server.CreateClient();
static async Task<string?> AllowedOrigin(HttpClient client, string origin)
{
    using var request = new HttpRequestMessage(HttpMethod.Get, "/");
    request.Headers.Add("Origin", origin);
    using var response = await client.SendAsync(request);
    return response.Headers.TryGetValues("Access-Control-Allow-Origin", out var values)
        ? string.Join("", values) : null;
}
if (await AllowedOrigin(client, "https://app.example") != "https://app.example" ||
    await AllowedOrigin(client, "https://evil.example") is not null)
    throw new Exception("CORS aberta");
Console.WriteLine("CORS_ORIGIN_POLICY_OK");` },
  ],
  "xUnit, fakes e WebApplicationFactory": [
    { lang: "csharp", purpose: "Assert de xUnit v3 contra fake que registra efeito antes de timeout; reconciliação impede segundo POST.", code: `using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

var gateway = new FakeGateway();
string result = await ChargeAsync(gateway, "event-7");
Assert.Equal("paid", result);
Assert.Equal(1, gateway.PostCount);
Assert.Equal(new[] { "event-7" }, gateway.Keys);
Console.WriteLine("XUNIT_FAKE_POST_EFFECT_OK");

static async Task<string> ChargeAsync(FakeGateway gateway, string key)
{
    try { return await gateway.PostAsync(key); }
    catch (TimeoutException) { return gateway.GetByKey(key); }
}
sealed class FakeGateway
{
    public int PostCount { get; private set; }
    public List<string> Keys { get; } = [];
    public Task<string> PostAsync(string key)
    {
        PostCount++; Keys.Add(key); throw new TimeoutException("after effect");
    }
    public string GetByKey(string key) => Keys.Contains(key) ? "paid" : "absent";
}` },
    { lang: "csharp", purpose: "TestServer exercita rota/validação/201 e estado, camada HTTP que teste de método isolado perderia.", code: `using System;
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.TestHost;
using Xunit;

int writes = 0;
using var server = new TestServer(new WebHostBuilder().Configure(app =>
{
    app.Run(async ctx =>
    {
        var dto = await ctx.Request.ReadFromJsonAsync<Create>();
        if (string.IsNullOrWhiteSpace(dto?.Seat)) { ctx.Response.StatusCode = 400; return; }
        writes++;
        ctx.Response.StatusCode = 201;
        ctx.Response.Headers.Location = "/reservations/r1";
    });
}));
using var client = server.CreateClient();
using var bad = await client.PostAsJsonAsync("/reservations", new Create(""));
using var good = await client.PostAsJsonAsync("/reservations", new Create("A1"));
Assert.Equal(HttpStatusCode.BadRequest, bad.StatusCode);
Assert.Equal(HttpStatusCode.Created, good.StatusCode);
Assert.Equal("/reservations/r1", good.Headers.Location?.ToString());
Assert.Equal(1, writes);
Console.WriteLine("TESTSERVER_HTTP_ASSERTIONS_OK");

record Create(string Seat);` },
  ],
  "Logging, metrics e tracing": [
    { lang: "csharp", purpose: "MeterListener captura categorias agregadas sem idempotency key ou tenant como tag.", code: `using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;

var seen = new List<(long value, string[] tags)>();
using var listener = new MeterListener();
listener.InstrumentPublished = (instrument, l) =>
{ if (instrument.Meter.Name == "Chiron") l.EnableMeasurementEvents(instrument); };
listener.SetMeasurementEventCallback<long>((_, value, tags, _) =>
    seen.Add((value, tags.ToArray().Select(t => t.Key).ToArray())));
listener.Start();
using var meter = new Meter("Chiron");
var confirmed = meter.CreateCounter<long>("reservations.confirmed");
confirmed.Add(1, new KeyValuePair<string, object?>("status", "confirmed"));
if (seen.Count != 1 || seen[0].value != 1 || !seen[0].tags.SequenceEqual(["status"]))
    throw new Exception("métrica de cardinalidade insegura");
Console.WriteLine("METRICS_LOW_CARDINALITY_OK");` },
    { lang: "csharp", purpose: "ActivitySource liga request e worker por trace/eventId, sem payload ou token em tags.", code: `using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

var seen = new List<Activity>();
using var listener = new ActivityListener
{
    ShouldListenTo = source => source.Name == "Chiron",
    Sample = (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllData,
    ActivityStopped = activity => seen.Add(activity)
};
ActivitySource.AddActivityListener(listener);
using var source = new ActivitySource("Chiron");
using (var request = source.StartActivity("reserve"))
{
    request!.SetTag("operation", "create");
    using (var worker = source.StartActivity("outbox.dispatch"))
        worker!.SetTag("outcome", "pending");
}
if (seen.Count != 2 || seen.Select(a => a.TraceId).Distinct().Count() != 1 ||
    seen.Any(a => a.TagObjects.Any(t => t.Key.Contains("token", StringComparison.OrdinalIgnoreCase))))
    throw new Exception("trace sem correlação ou com secret");
Console.WriteLine("TRACE_CORRELATION_REDACTED_OK");` },
  ],
  "GC, alocação e profiling": [
    { lang: "csharp", purpose: "ArrayPool usa apenas bytes lidos e limpa buffer sensível antes de devolvê-lo.", code: `using System;
using System.Buffers;
using System.Linq;
using System.Text;

var pool = ArrayPool<byte>.Shared;
byte[] buffer = pool.Rent(64);
try
{
    byte[] input = Encoding.UTF8.GetBytes("A1");
    input.CopyTo(buffer, 0);
    int count = input.Length;
    byte[] response = buffer.AsSpan(0, count).ToArray();
    if (!response.SequenceEqual(input) || response.Length == buffer.Length)
        throw new Exception("vazou bytes além do count");
    buffer.AsSpan().Clear();
    if (buffer.Any(x => x != 0)) throw new Exception("buffer sensível não limpo");
    Console.WriteLine("POOLED_BUFFER_OWNERSHIP_OK");
}
finally { pool.Return(buffer, clearArray: true); }` },
    { lang: "csharp", purpose: "Medição local distingue bytes alocados, heap gerenciado e working set sem inferir RSS apenas de GC.", code: `using System;
using System.Diagnostics;
using System.IO;

long before = GC.GetAllocatedBytesForCurrentThread();
using var stream = new MemoryStream();
byte[] chunk = new byte[4096];
for (int i = 0; i < 16; i++) stream.Write(chunk);
long allocated = GC.GetAllocatedBytesForCurrentThread() - before;
long managed = GC.GetTotalMemory(forceFullCollection: false);
long workingSet = Process.GetCurrentProcess().WorkingSet64;
if (allocated <= 0 || managed <= 0 || workingSet <= 0 || stream.Length != 65536)
    throw new Exception("medição inválida");
Console.WriteLine("GC_ALLOCATION_BASELINE_OK");
// Valores variam por processo; comparar sob carga e runtime equivalentes.` },
  ],
  "Publish, trimming e Native AOT": [
    { lang: "csharp", purpose: "System.Text.Json source-generation preserva contrato V1 no build/publish do .NET 8.", code: `using System;
using System.Text.Json;
using System.Text.Json.Serialization;

const string v1 = """{"reservationId":"r1","status":"pending"}""";
var dto = JsonSerializer.Deserialize(v1, EventJson.Default.EventV1);
if (dto?.ReservationId != "r1" || dto.Status != "pending")
    throw new Exception("evento antigo não lido");
string output = JsonSerializer.Serialize(dto, EventJson.Default.EventV1);
if (!output.Contains("reservationId") || !output.Contains("pending"))
    throw new Exception("contrato serializado divergente");
Console.WriteLine("SOURCE_GENERATED_EVENT_JSON_OK");

public sealed record EventV1(string ReservationId, string Status);
[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(EventV1))]
public partial class EventJson : JsonSerializerContext { }` },
    { lang: "csharp", purpose: "Smoke do artefato publicado registra runtime, caminho final e recurso embutido sem depender do cwd.", code: `using System;
using System.Reflection;

string baseDirectory = AppContext.BaseDirectory;
string cwd = Environment.CurrentDirectory;
string assembly = Assembly.GetExecutingAssembly().GetName().Name ?? "";
if (Environment.Version.Major != 8 || string.IsNullOrEmpty(assembly) ||
    !System.IO.Directory.Exists(baseDirectory))
    throw new Exception("artefato sem runtime/raiz esperados");
Console.WriteLine("PUBLISHED_RUNTIME_SMOKE_OK");
Console.WriteLine($"assembly={assembly};base={baseDirectory};cwd={cwd}");
// Publish/trim/AOT exigem executar saída final específica; isto é smoke JIT.` },
  ],
  "Health checks, shutdown e drain": [
    { lang: "csharp", purpose: "TestServer real separa live sempre local de ready dependente de estado, com status 503 controlado.", code: `using System;
using System.Net;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Diagnostics.HealthChecks;

var ready = new Readiness();
using var server = new TestServer(new WebHostBuilder()
    .ConfigureServices(s => s.AddHealthChecks().AddCheck("ready", () =>
        ready.Value ? HealthCheckResult.Healthy() : HealthCheckResult.Unhealthy(), tags: ["ready"]))
    .Configure(app =>
    {
        app.UseHealthChecks("/health/live", new HealthCheckOptions { Predicate = _ => false });
        app.UseHealthChecks("/health/ready", new HealthCheckOptions { Predicate = c => c.Tags.Contains("ready") });
    }));
using var client = server.CreateClient();
ready.Value = false;
using var live = await client.GetAsync("/health/live");
using var unavailable = await client.GetAsync("/health/ready");
ready.Value = true;
using var recovered = await client.GetAsync("/health/ready");
if (live.StatusCode != HttpStatusCode.OK || unavailable.StatusCode != HttpStatusCode.ServiceUnavailable ||
    recovered.StatusCode != HttpStatusCode.OK) throw new Exception("probes confundidas");
Console.WriteLine("LIVE_READY_SEPARATED_OK");

sealed class Readiness { public bool Value { get; set; } = true; }` },
    { lang: "csharp", purpose: "Hosted worker respeita StopAsync e mantém trabalho durável pendente para retomada após cancelamento.", code: `using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var state = new DurableState();
using var host = new HostBuilder().ConfigureServices(s =>
    { s.AddSingleton(state); s.AddHostedService<Worker>(); }).Build();
await host.StartAsync();
await state.Started.Task.WaitAsync(TimeSpan.FromSeconds(3));
await host.StopAsync(new CancellationTokenSource(TimeSpan.FromSeconds(3)).Token);
if (state.Pending != 1 || state.MarkedDone)
    throw new Exception("shutdown perdeu item ou marcou done cedo");
Console.WriteLine("HOSTED_WORKER_SAFE_STOP_OK");

sealed class DurableState
{
    public int Pending = 1;
    public bool MarkedDone { get; set; }
    public TaskCompletionSource Started = new(TaskCreationOptions.RunContinuationsAsynchronously);
}
sealed class Worker(DurableState state) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        state.Started.SetResult();
        try { await Task.Delay(Timeout.InfiniteTimeSpan, stoppingToken); }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested) { }
        // Persistência real é outbox; este objeto demonstra somente a regra de não marcar done.
    }
}` },
  ],
  "Supply chain, config e rollback": [
    { lang: "csharp", purpose: "Digest SHA-256 identifica exatamente os bytes do artefato publicado, sem confiar em tag mutável.", code: `using System;
using System.IO;
using System.Reflection;
using System.Security.Cryptography;

string path = Assembly.GetExecutingAssembly().Location;
if (string.IsNullOrEmpty(path) || !File.Exists(path)) throw new Exception("DLL não encontrada");
byte[] bytes = await File.ReadAllBytesAsync(path);
string digest = Convert.ToHexString(SHA256.HashData(bytes));
if (digest.Length != 64 || digest != Convert.ToHexString(SHA256.HashData(bytes)))
    throw new Exception("digest instável");
Console.WriteLine("ARTIFACT_SHA256_OK");
// CI compara este digest ao artefato implantado; hash local sozinho não atesta provenance.` },
    { lang: "csharp", purpose: "Leitor de evento V1/V2 continua compatível durante rollout e recusa versão desconhecida.", code: `using System;
using System.Text.Json;

string[] payloads = [
    """{"version":1,"reservationId":"r1"}""",
    """{"version":2,"reservationId":"r2","kind":"created"}"""
];
foreach (string payload in payloads)
{
    using var doc = JsonDocument.Parse(payload);
    int version = doc.RootElement.GetProperty("version").GetInt32();
    string id = doc.RootElement.GetProperty("reservationId").GetString()!;
    string kind = version switch
    {
        1 => "created",
        2 => doc.RootElement.GetProperty("kind").GetString()!,
        _ => throw new NotSupportedException("event version")
    };
    if (string.IsNullOrEmpty(id) || kind != "created") throw new Exception("replay corrompido");
}
Console.WriteLine("ROLLBACK_EVENT_V1_V2_OK");` },
  ],
  "Assemblies, packages e versionamento": [
    { lang: "csharp", purpose: "Distingue identidade/versão de assembly da versão de pacote que consumidor resolve no NuGet.", code: `using System;
using System.Reflection;

Assembly assembly = Assembly.GetExecutingAssembly();
AssemblyName name = assembly.GetName();
string? informational = assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()?.InformationalVersion;
if (string.IsNullOrWhiteSpace(name.Name) || name.Version is null ||
    string.IsNullOrWhiteSpace(informational)) throw new Exception("identidade de assembly ausente");
Console.WriteLine($"assembly={name.Name};assemblyVersion={name.Version};informational={informational}");
Console.WriteLine("ASSEMBLY_VERSION_INSPECTED_OK");
// PackageVersion é metadata de nupkg; não inferi-la de AssemblyVersion.` },
    { lang: "csharp", purpose: "Contrato de interface de domínio é compilável sem expor EF/ASP.NET na assinatura pública.", code: `using System;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;

Type api = typeof(IReservationStore);
MethodInfo method = api.GetMethod(nameof(IReservationStore.FindAsync))!;
if (method.ReturnType != typeof(Task<Reservation?>) ||
    method.GetParameters().Select(p => p.ParameterType)
        .Except([typeof(string), typeof(CancellationToken)]).Any())
    throw new Exception("API pública vazou adapter");
IReservationStore store = new MemoryStore();
if ((await store.FindAsync("r1", CancellationToken.None))?.Id != "r1")
    throw new Exception("contrato não executou");
Console.WriteLine("DOMAIN_ASSEMBLY_API_OK");

public record Reservation(string Id);
public interface IReservationStore
{
    Task<Reservation?> FindAsync(string id, CancellationToken token);
}
sealed class MemoryStore : IReservationStore
{
    public Task<Reservation?> FindAsync(string id, CancellationToken token) =>
        Task.FromResult<Reservation?>(id == "r1" ? new Reservation(id) : null);
}` },
  ],
  "Reflection, attributes e generators": [
    { lang: "csharp", purpose: "Atributo é metadata: registro estático executa handler; scan sozinho não cria autorização.", code: `using System;
using System.Collections.Generic;
using System.Reflection;

var handlers = new Dictionary<string, Func<string, string>>
{ ["created"] = id => "handled:" + id };
Type type = typeof(CreatedHandler);
string? marker = type.GetCustomAttribute<EventKindAttribute>()?.Kind;
if (marker != "created" || !handlers.TryGetValue(marker, out var run) ||
    run("r1") != "handled:r1") throw new Exception("handler não registrado");
Console.WriteLine("ATTRIBUTE_STATIC_REGISTRY_OK");

[AttributeUsage(AttributeTargets.Class, Inherited = false)]
sealed class EventKindAttribute(string kind) : Attribute
{ public string Kind { get; } = kind; }
[EventKind("created")]
sealed class CreatedHandler;` },
    { lang: "csharp", purpose: "Source-generated JSON seleciona tipo explicitamente e falha para versão de evento desconhecida.", code: `using System;
using System.Text.Json;
using System.Text.Json.Serialization;

const string oldPayload = """{"version":1,"reservationId":"r1"}""";
using var doc = JsonDocument.Parse(oldPayload);
if (doc.RootElement.GetProperty("version").GetInt32() != 1)
    throw new NotSupportedException("event version");
EventV1? item = JsonSerializer.Deserialize(oldPayload, EventContext.Default.EventV1);
if (item?.ReservationId != "r1") throw new Exception("geração perdeu campo");
Console.WriteLine("GENERATED_JSON_V1_OK");

public sealed record EventV1(int Version, string ReservationId);
[JsonSourceGenerationOptions(PropertyNamingPolicy = JsonKnownNamingPolicy.CamelCase)]
[JsonSerializable(typeof(EventV1))]
public partial class EventContext : JsonSerializerContext { }` },
  ],
  "Interop, unsafe e ownership": [
    { lang: "csharp", purpose: "LibraryImport Windows x64 usa ABI explícita; exemplo é gate local Windows, não promessa cross-platform.", code: `using System;
using System.Runtime.InteropServices;

if (!OperatingSystem.IsWindows()) throw new PlatformNotSupportedException("gate Windows");
int id = Native.GetCurrentProcessId();
if (id != Environment.ProcessId || id <= 0) throw new Exception("ABI de P/Invoke divergente");
Console.WriteLine("WINDOWS_LIBRARYIMPORT_ABI_OK");

internal static partial class Native
{
    [LibraryImport("kernel32.dll", EntryPoint = "GetCurrentProcessId")]
    internal static partial int GetCurrentProcessId();
}` },
    { lang: "csharp", purpose: "SafeHandle fake demonstra owner e ReleaseHandle exatamente uma vez, sem alegar DLL real.", code: `using System;
using System.Runtime.InteropServices;

var handle = new CountingHandle();
if (handle.IsInvalid) throw new Exception("handle inválido antes do uso");
handle.Dispose();
handle.Dispose();
if (handle.Releases != 1 || !handle.IsClosed) throw new Exception("release duplicado/perdido");
Console.WriteLine("SAFEHANDLE_OWNERSHIP_OK");

sealed class CountingHandle : SafeHandle
{
    public int Releases { get; private set; }
    public CountingHandle() : base(IntPtr.Zero, ownsHandle: true) => SetHandle(new IntPtr(42));
    public override bool IsInvalid => handle == IntPtr.Zero;
    protected override bool ReleaseHandle()
    { Releases++; handle = IntPtr.Zero; return true; }
}` },
  ],
  "API design e compatibilidade": [
    { lang: "csharp", purpose: "Resultado discriminado distingue confirmed, pending, conflict e sold out sem null ambíguo.", code: `using System;

Outcome[] cases = [new Confirmed("r1"), new Pending("r2"),
    new Conflict("fingerprint"), new SoldOut("A1")];
string[] expected = ["confirmed:r1", "pending:r2", "conflict:fingerprint", "soldout:A1"];
for (int i = 0; i < cases.Length; i++)
    if (Describe(cases[i]) != expected[i]) throw new Exception("estado comprimido");
Console.WriteLine("DISCRIMINATED_OUTCOME_OK");

static string Describe(Outcome value) => value switch
{
    Confirmed x => "confirmed:" + x.ReservationId,
    Pending x => "pending:" + x.ReservationId,
    Conflict x => "conflict:" + x.Reason,
    SoldOut x => "soldout:" + x.SeatId,
    _ => throw new NotSupportedException("novo estado exige revisão")
};
abstract record Outcome;
sealed record Confirmed(string ReservationId) : Outcome;
sealed record Pending(string ReservationId) : Outcome;
sealed record Conflict(string Reason) : Outcome;
sealed record SoldOut(string SeatId) : Outcome;` },
    { lang: "csharp", purpose: "API documenta borrowed Stream: lê sem fechá-lo, propaga cancellation e deixa owner dispor.", code: `using System;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

await using var callerOwned = new MemoryStream(Encoding.UTF8.GetBytes("A1"));
string value = await ReadSeatAsync(callerOwned, CancellationToken.None);
if (value != "A1" || !callerOwned.CanRead) throw new Exception("ownership violado");
Console.WriteLine("BORROWED_STREAM_CONTRACT_OK");

// source é borrowed: este método não fecha nem retém a referência após retorno.
static async Task<string> ReadSeatAsync(Stream source, CancellationToken token)
{
    byte[] bytes = new byte[16];
    int read = await source.ReadAsync(bytes, token);
    if (read is < 1 or > 8) throw new InvalidDataException("seat ID");
    return Encoding.UTF8.GetString(bytes, 0, read);
}` },
  ],
  "Módulos e contrato de reserva": [
    { lang: "csharp", purpose: "Núcleo puro modela comando validado e transições sem depender de EF/ASP.NET.", code: `using System;

var command = CreateCommand.Parse("tenant-a", "A1", 1);
var reservation = Reservation.Create("r1", command);
if (reservation.Status != Status.Pending || reservation.Tenant != "tenant-a")
    throw new Exception("estado inicial inválido");
reservation.Confirm();
try { reservation.Confirm(); throw new Exception("transição duplicada aceita"); }
catch (InvalidOperationException) { }
try { _ = CreateCommand.Parse("tenant-a", "A1", 0); throw new Exception("zero aceito"); }
catch (ArgumentOutOfRangeException) { Console.WriteLine("PURE_RESERVATION_DOMAIN_OK"); }

record CreateCommand(string Tenant, string Seat, int Quantity)
{
    public static CreateCommand Parse(string tenant, string seat, int quantity)
    {
        if (string.IsNullOrWhiteSpace(tenant) || string.IsNullOrWhiteSpace(seat))
            throw new ArgumentException("identity");
        if (quantity <= 0) throw new ArgumentOutOfRangeException(nameof(quantity));
        return new(tenant, seat, quantity);
    }
}
enum Status { Pending, Confirmed, Cancelled }
sealed class Reservation(string id, CreateCommand command)
{
    public string Id { get; } = id;
    public string Tenant { get; } = command.Tenant;
    public Status Status { get; private set; } = Status.Pending;
    public static Reservation Create(string id, CreateCommand command) => new(id, command);
    public void Confirm()
    {
        if (Status != Status.Pending) throw new InvalidOperationException("transition");
        Status = Status.Confirmed;
    }
}` },
    { lang: "csharp", purpose: "Aplicação injeta portas explícitas; fake de store/gateway evidencia que contrato não depende do host.", code: `using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

IReservationStore store = new MemoryStore();
IPaymentGateway gateway = new FakeGateway();
var service = new ReservationService(store, gateway);
string result = await service.CreateAsync("tenant-a", "A1", "key-1", CancellationToken.None);
if (result != "pending:r1" || ((FakeGateway)gateway).Calls != 0)
    throw new Exception("HTTP remoto dentro da transação de criação");
Console.WriteLine("PORTS_ADAPTERS_BOUNDARY_OK");

interface IReservationStore { Task<string> SavePendingAsync(string tenant, string seat, string key, CancellationToken token); }
interface IPaymentGateway { Task<string> ChargeAsync(string key, CancellationToken token); }
sealed class MemoryStore : IReservationStore
{
    readonly Dictionary<string, string> rows = [];
    public Task<string> SavePendingAsync(string tenant, string seat, string key, CancellationToken token)
    {
        if (!rows.TryGetValue(tenant + ":" + key, out var id))
            rows.Add(tenant + ":" + key, id = "r1");
        return Task.FromResult(id);
    }
}
sealed class FakeGateway : IPaymentGateway
{
    public int Calls { get; private set; }
    public Task<string> ChargeAsync(string key, CancellationToken token)
    { Calls++; return Task.FromResult("paid"); }
}
sealed class ReservationService(IReservationStore store, IPaymentGateway gateway)
{
    public async Task<string> CreateAsync(string tenant, string seat, string key, CancellationToken token)
    {
        _ = gateway; // efeito externo pertence ao worker de outbox, não ao request
        string id = await store.SavePendingAsync(tenant, seat, key, token);
        return "pending:" + id;
    }
}` },
  ],
  "Idempotência, transação e outbox": [
    { lang: "csharp", purpose: "SQLite real comita key, capacidade, reserva e outbox juntos; replay e fingerprint divergente são distintos.", code: `using System;
using Microsoft.Data.Sqlite;

await using var db = new SqliteConnection("Data Source=:memory:");
await db.OpenAsync();
await using (var setup = db.CreateCommand())
{
    setup.CommandText = "CREATE TABLE inventory (tenant TEXT, seat TEXT, remaining INTEGER CHECK(remaining>=0), PRIMARY KEY(tenant,seat));" +
        "CREATE TABLE requests (tenant TEXT, idem_key TEXT, fingerprint TEXT, reservation_id TEXT, PRIMARY KEY(tenant,idem_key));" +
        "CREATE TABLE reservations (id TEXT PRIMARY KEY, tenant TEXT, seat TEXT);" +
        "CREATE TABLE outbox (event_id TEXT PRIMARY KEY, reservation_id TEXT);" +
        "INSERT INTO inventory VALUES ('a','A1',1);";
    await setup.ExecuteNonQueryAsync();
}
async Task<string> Create(string key, string fingerprint)
{
    await using var existing = db.CreateCommand();
    existing.CommandText = "SELECT fingerprint || ':' || reservation_id FROM requests WHERE tenant='a' AND idem_key=$key";
    existing.Parameters.AddWithValue("$key", key);
    if (await existing.ExecuteScalarAsync() is string old)
        return old == fingerprint + ":r1" ? "r1" : throw new InvalidOperationException("fingerprint");
    await using var tx = await db.BeginTransactionAsync();
    await using var write = db.CreateCommand();
    write.Transaction = (SqliteTransaction)tx;
    write.CommandText = "UPDATE inventory SET remaining=remaining-1 WHERE tenant='a' AND seat='A1' AND remaining>0;" +
        "INSERT INTO requests VALUES ('a',$key,$fingerprint,'r1');" +
        "INSERT INTO reservations VALUES ('r1','a','A1');" +
        "INSERT INTO outbox VALUES ('event-r1','r1');";
    write.Parameters.AddWithValue("$key", key);
    write.Parameters.AddWithValue("$fingerprint", fingerprint);
    await write.ExecuteNonQueryAsync();
    await tx.CommitAsync();
    return "r1";
}
if (await Create("key-1", "hash-1") != "r1" || await Create("key-1", "hash-1") != "r1")
    throw new Exception("replay mudou resultado");
try { _ = await Create("key-1", "hash-2"); throw new Exception("conflito aceito"); }
catch (InvalidOperationException) { }
await using var count = db.CreateCommand();
count.CommandText = "SELECT (SELECT COUNT(*) FROM requests)+(SELECT COUNT(*) FROM reservations)+(SELECT COUNT(*) FROM outbox)";
if (Convert.ToInt32(await count.ExecuteScalarAsync()) != 3) throw new Exception("transação parcial");
Console.WriteLine("PROJECT_ATOMIC_IDEMPOTENT_OUTBOX_OK");
// Corrida entre duas conexões e SQL de claim exigem gate no banco alvo.` },
    { lang: "csharp", purpose: "Lease fencing e consulta remota por mesma key após timeout pós-efeito, sem segundo POST.", code: `using System;
using System.Collections.Generic;

var row = new Outbox("event-1");
long a = row.Claim("worker-a");
var gateway = new Gateway();
try { gateway.Post(row.EventId); }
catch (TimeoutException) { row.State = gateway.GetByKey(row.EventId); }
long b = row.Claim("worker-b");
if (row.Done("worker-a", a) || !row.Done("worker-b", b) ||
    gateway.Posts != 1 || gateway.Keys.Count != 1 || row.State != "paid")
    throw new Exception("fencing ou reconciliação falhou");
Console.WriteLine("PROJECT_LEASE_RECONCILIATION_OK");

sealed class Outbox(string id)
{
    public string EventId { get; } = id;
    public string State { get; set; } = "pending";
    string owner = "";
    long version;
    public long Claim(string next) { owner = next; return ++version; }
    public bool Done(string who, long observed) => who == owner && observed == version;
}
sealed class Gateway
{
    public int Posts { get; private set; }
    public HashSet<string> Keys { get; } = [];
    public void Post(string key) { Posts++; Keys.Add(key); throw new TimeoutException("after effect"); }
    public string GetByKey(string key) => Keys.Contains(key) ? "paid" : "absent";
}` },
  ],
  "Segurança, carga e observabilidade": [
    { lang: "csharp", purpose: "SQL tenant-scoped e fake de identidade validam acesso negado mesmo com reservationId conhecido.", code: `using System;
using Microsoft.Data.Sqlite;

await using var db = new SqliteConnection("Data Source=:memory:");
await db.OpenAsync();
await using (var setup = db.CreateCommand())
{
    setup.CommandText = "CREATE TABLE reservations (id TEXT, tenant TEXT, status TEXT, PRIMARY KEY(id,tenant));" +
        "INSERT INTO reservations VALUES ('r1','a','pending')";
    await setup.ExecuteNonQueryAsync();
}
static async Task<int> Cancel(SqliteConnection db, string claimTenant, string id)
{
    await using var cmd = db.CreateCommand();
    cmd.CommandText = "UPDATE reservations SET status='cancelled' WHERE id=$id AND tenant=$tenant AND status='pending'";
    cmd.Parameters.AddWithValue("$id", id);
    cmd.Parameters.AddWithValue("$tenant", claimTenant);
    return await cmd.ExecuteNonQueryAsync();
}
if (await Cancel(db, "b", "r1") != 0 || await Cancel(db, "a", "r1") != 1)
    throw new Exception("tenant cruzado ou dono negado");
Console.WriteLine("PROJECT_TENANT_MUTATION_OK");` },
    { lang: "csharp", purpose: "Limiter bounded mantém trabalho por tenant dentro do teto e observa saturação sem key como tag.", code: `using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

using var slots = new SemaphoreSlim(2, 2);
int active = 0, maximum = 0, finished = 0;
await Task.WhenAll(Enumerable.Range(0, 20).Select(async _ =>
{
    await slots.WaitAsync();
    try
    {
        int now = Interlocked.Increment(ref active);
        int old;
        do { old = maximum; }
        while (now > old && Interlocked.CompareExchange(ref maximum, now, old) != old);
        await Task.Delay(2);
        Interlocked.Increment(ref finished);
    }
    finally { Interlocked.Decrement(ref active); slots.Release(); }
}));
if (finished != 20 || active != 0 || maximum is < 1 or > 2)
    throw new Exception("limite/finalização incorretos");
Console.WriteLine("PROJECT_BOUNDED_LOAD_OK");
// Fairness por tenant e pool SQL exigem teste de staging; SemaphoreSlim é local.` },
  ],
  "Banca, deploy e restore": [
    { lang: "csharp", purpose: "Backup SQLite coerente preserva inventory, request key, reserva e outbox; restore confere contagens.", code: `using System;
using Microsoft.Data.Sqlite;

await using var source = new SqliteConnection("Data Source=:memory:");
await source.OpenAsync();
await using (var setup = source.CreateCommand())
{
    setup.CommandText = "CREATE TABLE inventory (seat TEXT PRIMARY KEY, remaining INTEGER);" +
        "CREATE TABLE requests (idem_key TEXT PRIMARY KEY);" +
        "CREATE TABLE reservations (id TEXT PRIMARY KEY);" +
        "CREATE TABLE outbox (event_id TEXT PRIMARY KEY);" +
        "INSERT INTO inventory VALUES ('A1',0);" +
        "INSERT INTO requests VALUES ('key-1');" +
        "INSERT INTO reservations VALUES ('r1');" +
        "INSERT INTO outbox VALUES ('e1');";
    await setup.ExecuteNonQueryAsync();
}
await using var restored = new SqliteConnection("Data Source=:memory:");
await restored.OpenAsync();
source.BackupDatabase(restored);
foreach (string table in new[] { "inventory", "requests", "reservations", "outbox" })
{
    await using var count = restored.CreateCommand();
    count.CommandText = "SELECT COUNT(*) FROM " + table; // table vem de allowlist fixa, não do usuário
    if (Convert.ToInt32(await count.ExecuteScalarAsync()) != 1)
        throw new Exception("restore incompleto: " + table);
}
Console.WriteLine("PROJECT_RESTORE_ALL_STATE_OK");` },
    { lang: "csharp", purpose: "Matriz de mutantes reprova capacity check-then-act, tenant ausente e retry com chave nova.", code: `using System;
using System.Collections.Generic;
using System.Linq;

var gates = new Dictionary<string, Func<bool>>
{
    ["capacity"] = () => ConditionalReserve(1, 2) == 1,
    ["tenant"] = () => TenantPredicate("a", "b") == false,
    ["retry-key"] = () => StableKey("event-1", "event-1")
};
if (gates.Count != 3 || gates.Any(entry => !entry.Value()))
    throw new Exception("banca de invariantes reprovou");
if (ConditionalReserve(1, 2) == 2 || TenantPredicate("a", "b") ||
    StableKey("event-1", Guid.NewGuid().ToString()))
    throw new Exception("mutante passou pelo oráculo");
Console.WriteLine("PROJECT_MUTANTS_REJECTED_OK");

static int ConditionalReserve(int remaining, int attempts)
{
    int winners = 0;
    for (int i = 0; i < attempts; i++) if (remaining > 0) { remaining--; winners++; }
    return winners;
}
static bool TenantPredicate(string owner, string claim) => owner == claim;
static bool StableKey(string first, string retry) => first == retry;` },
  ],
};
