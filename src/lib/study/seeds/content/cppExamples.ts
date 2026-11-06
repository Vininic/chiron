export type CppExample = { lang: "cpp"; code: string; purpose: string };

/** Dois exemplos por seção redigida; permanecem draft até compiler C++20 real. */
export const CPP_EXAMPLES: Record<string, [CppExample, CppExample]> = {
  "C++20, C++23 e matriz de compiladores": [
    { lang: "cpp", purpose: "Programa C++20 falha em dialect anterior e registra macro da implementação.", code: `#include <cstdlib>
#include <iostream>

#if __cplusplus < 202002L
#error "Este exemplo exige C++20"
#endif

int main() {
    std::cout << "cplusplus=" << __cplusplus << '\n';
    return EXIT_SUCCESS;
}` },
    { lang: "cpp", purpose: "Feature-test é consultada sem afirmar que C++23 está habilitado; baseline usa std::span C++20.", code: `#include <array>
#include <cstdlib>
#include <iostream>
#include <span>

int main() {
    std::array<int, 3> values{20, 21, 0};
    std::span<const int> view{values};
    if (view.size() != 3 || view[0] + view[1] != 41) return EXIT_FAILURE;
    std::cout << "CXX20_SPAN_OK\n";
}` },
  ],
  "Inicialização, auto e conversões": [
    { lang: "cpp", purpose: "Factory valida signed antes de converter para size_t e preserva domínio forte.", code: `#include <cstdlib>
#include <iostream>
#include <limits>
#include <optional>

struct Quantity { std::size_t value; };
std::optional<Quantity> quantity_from(long value) {
    if (value <= 0 || static_cast<unsigned long>(value) >
        std::numeric_limits<std::size_t>::max()) return std::nullopt;
    return Quantity{static_cast<std::size_t>(value)};
}

int main() {
    if (quantity_from(-1)) return EXIT_FAILURE;
    auto q = quantity_from(3);
    if (!q || q->value != 3) return EXIT_FAILURE;
    std::cout << "CHECKED_QUANTITY_OK\n";
}` },
    { lang: "cpp", purpose: "Out é publicado somente depois de toda validação, mantendo sentinela na falha.", code: `#include <cstdlib>
#include <iostream>
#include <string>

struct Result { int id; int remaining; };
bool make_result(int id, int remaining, std::string currency, Result& out) {
    if (id <= 0 || remaining < 0 || currency != "BRL") return false;
    Result temp{id, remaining};
    out = temp;
    return true;
}

int main() {
    Result out{7, 7};
    if (make_result(41, 0, "USD", out) || out.id != 7) return EXIT_FAILURE;
    if (!make_result(41, 0, "BRL", out) || out.id != 41) return EXIT_FAILURE;
    std::cout << "STRONG_OUTPUT_GUARANTEE_OK\n";
}` },
  ],
  "Valores, referências e const": [
    { lang: "cpp", purpose: "Worker adquire string owned em vez de reter string_view do request.", code: `#include <cstdlib>
#include <iostream>
#include <string>
#include <string_view>

struct Work { std::string key; };
Work enqueue_copy(std::string_view borrowed) { return Work{std::string{borrowed}}; }

int main() {
    std::string request = "key-41";
    Work work = enqueue_copy(request);
    request.assign("changed");
    if (work.key != "key-41") return EXIT_FAILURE;
    std::cout << "OWNED_ASYNC_VALUE_OK\n";
}` },
    { lang: "cpp", purpose: "Movimento transfere key e código usa o destino, nunca depende do conteúdo moved-from.", code: `#include <cstdlib>
#include <iostream>
#include <string>
#include <utility>

struct Event { std::string key; };
int main() {
    std::string request_key = "key-41";
    Event event{std::move(request_key)};
    if (event.key != "key-41") return EXIT_FAILURE;
    request_key.clear(); // apenas operação válida; conteúdo anterior não é requisito
    if (event.key != "key-41") return EXIT_FAILURE;
    std::cout << "MOVE_DESTINATION_IS_AUTHORITY_OK\n";
}` },
  ],
  "Enums, variant e estados": [
    { lang: "cpp", purpose: "Decoder mapeia wire explicitamente e rejeita estado futuro sem cast cego.", code: `#include <cstdlib>
#include <iostream>
#include <optional>

enum class Status : unsigned char { pending, confirmed, sold_out };
std::optional<Status> decode(unsigned char wire) {
    switch (wire) {
        case 1: return Status::pending;
        case 2: return Status::confirmed;
        case 3: return Status::sold_out;
        default: return std::nullopt;
    }
}

int main() {
    if (decode(99)) return EXIT_FAILURE;
    if (decode(2) != Status::confirmed) return EXIT_FAILURE;
    std::cout << "WIRE_ENUM_MAPPING_OK\n";
}` },
    { lang: "cpp", purpose: "Variant mantém tag/payload coerentes e visitor trata cada alternativa.", code: `#include <cstdlib>
#include <iostream>
#include <string>
#include <variant>

struct Created { int id; };
struct Conflict { std::string reason; };
struct Unknown {};
using Outcome = std::variant<Created, Conflict, Unknown>;
int status(const Outcome& value) {
    return std::visit([](const auto& item) -> int {
        using T = std::decay_t<decltype(item)>;
        if constexpr (std::is_same_v<T, Created>) return 201;
        else if constexpr (std::is_same_v<T, Conflict>) return 409;
        else return 202;
    }, value);
}

int main() {
    if (status(Created{41}) != 201 || status(Conflict{"fingerprint"}) != 409 ||
        status(Unknown{}) != 202) return EXIT_FAILURE;
    std::cout << "VARIANT_OUTCOMES_OK\n";
}` },
  ],
  "Classes, invariantes e construtores": [
    { lang: "cpp", purpose: "Factory produz Quantity somente quando invariante é satisfeita e impede conversão implícita.", code: `#include <cstdlib>
#include <iostream>
#include <optional>
#include <type_traits>

class Quantity {
    int value_;
    explicit Quantity(int value) : value_{value} {}
public:
    static std::optional<Quantity> from(int value) {
        if (value <= 0 || value > 1000) return std::nullopt;
        return Quantity{value};
    }
    int value() const { return value_; }
};

int main() {
    static_assert(!std::is_convertible_v<int, Quantity>);
    if (Quantity::from(-1)) return EXIT_FAILURE;
    auto q = Quantity::from(41);
    if (!q || q->value() != 41) return EXIT_FAILURE;
    std::cout << "VALID_CONSTRUCTION_ONLY_OK\n";
}` },
    { lang: "cpp", purpose: "Interface polimórfica possui destrutor virtual e construção completa precede start explícito.", code: `#include <cstdlib>
#include <iostream>
#include <memory>

struct Adapter {
    virtual ~Adapter() = default;
    virtual int start() = 0;
};
struct Fake final : Adapter {
    static inline int destroyed = 0;
    ~Fake() override { ++destroyed; }
    int start() override { return 41; }
};

int main() {
    {
        std::unique_ptr<Adapter> adapter = std::make_unique<Fake>();
        if (adapter->start() != 41) return EXIT_FAILURE;
    }
    if (Fake::destroyed != 1) return EXIT_FAILURE;
    std::cout << "POLYMORPHIC_DESTRUCTION_OK\n";
}` },
  ],
  "RAII e destrutores": [
    { lang: "cpp", purpose: "Transaction guard faz rollback por padrão e só preserva commit explicitamente confirmado.", code: `#include <cstdlib>
#include <iostream>

struct Database { int commits{}, rollbacks{}; };
class Transaction {
    Database& db_; bool committed_ = false;
public:
    explicit Transaction(Database& db) : db_{db} {}
    Transaction(const Transaction&) = delete;
    ~Transaction() noexcept { if (!committed_) ++db_.rollbacks; }
    void commit() { ++db_.commits; committed_ = true; }
};

int main() {
    Database db;
    { Transaction tx{db}; }
    { Transaction tx{db}; tx.commit(); }
    if (db.rollbacks != 1 || db.commits != 1) return EXIT_FAILURE;
    std::cout << "RAII_ROLLBACK_DEFAULT_OK\n";
}` },
    { lang: "cpp", purpose: "Owner move-only libera handle exatamente uma vez, inclusive ao mover sobre destino ocupado.", code: `#include <cstdlib>
#include <iostream>
#include <utility>

struct Counter { int closes{}; };
class Handle {
    Counter* counter_{}; int value_{};
    void close() noexcept { if (value_) { ++counter_->closes; value_ = 0; } }
public:
    Handle(Counter& c, int v) : counter_{&c}, value_{v} {}
    ~Handle() noexcept { close(); }
    Handle(const Handle&) = delete;
    Handle& operator=(const Handle&) = delete;
    Handle(Handle&& other) noexcept : counter_{other.counter_}, value_{std::exchange(other.value_,0)} {}
    Handle& operator=(Handle&& other) noexcept {
        if (this != &other) { close(); counter_ = other.counter_; value_ = std::exchange(other.value_,0); }
        return *this;
    }
};

int main() {
    Counter c;
    { Handle a{c,1}; Handle b{c,2}; b = std::move(a); }
    if (c.closes != 2) return EXIT_FAILURE;
    std::cout << "MOVE_OWNER_CLOSE_ONCE_OK\n";
}` },
  ],
  "unique_ptr, shared_ptr e weak_ptr": [
    { lang: "cpp", purpose: "Enqueue transfere unique_ptr somente quando há capacidade e mantém owner no caller na falha.", code: `#include <cstdlib>
#include <iostream>
#include <memory>
#include <vector>

bool enqueue(std::vector<std::unique_ptr<int>>& q, std::unique_ptr<int>& item) {
    if (!item || q.size() >= 1) return false;
    q.push_back(std::move(item));
    return true;
}

int main() {
    std::vector<std::unique_ptr<int>> q;
    auto first = std::make_unique<int>(41);
    auto second = std::make_unique<int>(42);
    if (!enqueue(q, first) || first) return EXIT_FAILURE;
    if (enqueue(q, second) || !second || *second != 42 || *q[0] != 41)
        return EXIT_FAILURE;
    std::cout << "UNIQUE_OWNERSHIP_ON_SUCCESS_OK\n";
}` },
    { lang: "cpp", purpose: "weak_ptr quebra back-reference e não prolonga lifetime após raiz ser destruída.", code: `#include <cstdlib>
#include <iostream>
#include <memory>

struct Session;
struct Worker { std::weak_ptr<Session> session; };
struct Session { static inline int destroyed{}; std::shared_ptr<Worker> worker; ~Session(){++destroyed;} };

int main() {
    std::weak_ptr<Session> observer;
    {
        auto session = std::make_shared<Session>();
        session->worker = std::make_shared<Worker>();
        session->worker->session = session;
        observer = session;
    }
    if (!observer.expired() || Session::destroyed != 1) return EXIT_FAILURE;
    std::cout << "WEAK_BACK_REFERENCE_OK\n";
}` },
  ],
  "Rule of zero, move e cópia": [
    { lang: "cpp", purpose: "Value object segue rule of zero e cópia profunda dos membros standard permanece independente.", code: `#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>

struct Snapshot { std::string key; std::vector<int> seats; };
int main() {
    Snapshot a{"key-41", {1,2}};
    Snapshot b = a;
    a.key = "changed"; a.seats[0] = 9;
    if (b.key != "key-41" || b.seats[0] != 1) return EXIT_FAILURE;
    std::cout << "RULE_OF_ZERO_VALUE_COPY_OK\n";
}` },
    { lang: "cpp", purpose: "Movimento de owner invalida apenas origem lógica e libera recurso uma vez.", code: `#include <cstdlib>
#include <iostream>
#include <memory>
#include <type_traits>
#include <utility>

class Connection {
    std::unique_ptr<int> handle_;
public:
    explicit Connection(int id) : handle_{std::make_unique<int>(id)} {}
    Connection(Connection&&) noexcept = default;
    Connection& operator=(Connection&&) noexcept = default;
    Connection(const Connection&) = delete;
    Connection& operator=(const Connection&) = delete;
    int id() const { return handle_ ? *handle_ : 0; }
};

int main() {
    static_assert(!std::is_copy_constructible_v<Connection>);
    Connection a{41}; Connection b{42};
    b = std::move(a);
    if (b.id() != 41 || a.id() != 0) return EXIT_FAILURE;
    std::cout << "MOVE_ONLY_RESOURCE_OK\n";
}` },
  ],
  "vector, span e invalidação": [
    { lang: "cpp", purpose: "Índice/ID é reobtido depois de crescimento; nenhum ponteiro anterior a push_back é retido.", code: `#include <cstdlib>
#include <iostream>
#include <vector>

struct Reservation { int id; bool confirmed; };
int main() {
    std::vector<Reservation> rows;
    rows.reserve(1);
    rows.push_back({41, false});
    rows.push_back({42, false}); // pode realocar
    for (auto& row : rows) if (row.id == 41) row.confirmed = true;
    if (!rows[0].confirmed || rows[1].confirmed) return EXIT_FAILURE;
    std::cout << "VECTOR_NO_STALE_POINTER_OK\n";
}` },
    { lang: "cpp", purpose: "span é usado somente durante a chamada síncrona e subspan recebe limites validados.", code: `#include <array>
#include <cstdlib>
#include <iostream>
#include <span>

int sum_prefix(std::span<const int> values, std::size_t count) {
    if (count > values.size()) return -1;
    int total = 0;
    for (int value : values.first(count)) total += value;
    return total;
}

int main() {
    std::array values{20,21,99};
    if (sum_prefix(values,2) != 41 || sum_prefix(values,4) != -1)
        return EXIT_FAILURE;
    std::cout << "SPAN_BOUNDED_BORROW_OK\n";
}` },
  ],
  "string, string_view e UTF-8": [
    { lang: "cpp", purpose: "Parser recebe string_view bounded, exige consumo total e mantém out em input inválido.", code: `#include <charconv>
#include <cstdlib>
#include <iostream>
#include <string_view>

bool parse_quantity(std::string_view text, int& out) {
    int value = 0;
    auto [ptr, ec] = std::from_chars(text.data(), text.data()+text.size(), value);
    if (ec != std::errc{} || ptr != text.data()+text.size() || value < 1 || value > 1000)
        return false;
    out = value;
    return true;
}

int main() {
    int value = 7;
    if (parse_quantity("3x",value) || value != 7) return EXIT_FAILURE;
    if (!parse_quantity("3",value) || value != 3) return EXIT_FAILURE;
    std::cout << "FROM_CHARS_TOTAL_CONSUMPTION_OK\n";
}` },
    { lang: "cpp", purpose: "Async work copia bytes owned e rejeita NUL para key técnica ASCII.", code: `#include <cstdlib>
#include <iostream>
#include <optional>
#include <string>
#include <string_view>

std::optional<std::string> own_key(std::string_view view) {
    if (view.empty() || view.size() > 16) return std::nullopt;
    for (unsigned char c : view)
        if (!((c>='a'&&c<='z') || (c>='0'&&c<='9') || c=='-')) return std::nullopt;
    return std::string{view};
}

int main() {
    const char raw[3] = {'a','\0','b'};
    if (own_key(std::string_view{raw,3})) return EXIT_FAILURE;
    auto key = own_key("key-41");
    if (!key || *key != "key-41") return EXIT_FAILURE;
    std::cout << "OWNED_ASCII_KEY_OK\n";
}` },
  ],
  "map, unordered_map e hashing": [
    { lang: "cpp", purpose: "Hash e equality incluem tenant e key e obedecem igualdade implica mesmo hash.", code: `#include <cstdlib>
#include <functional>
#include <iostream>
#include <string>
#include <unordered_map>

struct Key { std::string tenant, key; bool operator==(const Key&) const = default; };
struct Hash {
    std::size_t operator()(const Key& k) const {
        auto a=std::hash<std::string>{}(k.tenant), b=std::hash<std::string>{}(k.key);
        return a ^ (b + 0x9e3779b9u + (a<<6) + (a>>2));
    }
};

int main() {
    std::unordered_map<Key,int,Hash> rows;
    rows.emplace(Key{"a","same"},41);
    rows.emplace(Key{"b","same"},42);
    if (rows.size()!=2 || rows.at({"a","same"})!=41 || rows.at({"b","same"})!=42)
        return EXIT_FAILURE;
    std::cout << "COMPOSITE_HASH_KEY_OK\n";
}` },
    { lang: "cpp", purpose: "find não insere estado default em miss; try_emplace diferencia primeira inserção de replay.", code: `#include <cstdlib>
#include <iostream>
#include <map>
#include <string>

int main() {
    std::map<std::string,int> receipts;
    if (receipts.find("missing") != receipts.end() || !receipts.empty()) return EXIT_FAILURE;
    auto [first, inserted] = receipts.try_emplace("key-41",41);
    auto [again, repeated] = receipts.try_emplace("key-41",99);
    if (!inserted || repeated || first->second!=41 || again->second!=41 || receipts.size()!=1)
        return EXIT_FAILURE;
    std::cout << "NO_ACCIDENTAL_MAP_INSERT_OK\n";
}` },
  ],
  "ranges e algoritmos": [
    { lang: "cpp", purpose: "View vive dentro do escopo da origem e é materializada em valores owned antes de escapar.", code: `#include <cstdlib>
#include <iostream>
#include <ranges>
#include <vector>

int main() {
    std::vector<int> source{1,2,3,4};
    auto even_view = source | std::views::filter([](int value){ return value%2==0; });
    std::vector<int> owned;
    for (int value : even_view) owned.push_back(value);
    source.clear();
    if (owned != std::vector<int>{2,4}) return EXIT_FAILURE;
    std::cout << "RANGE_MATERIALIZED_BEFORE_ESCAPE_OK\n";
}` },
    { lang: "cpp", purpose: "Comparator relacional ordena extremos sem subtração e possui desempate por ID.", code: `#include <algorithm>
#include <climits>
#include <cstdlib>
#include <iostream>
#include <vector>

struct Event { int sequence; int id; };
int main() {
    std::vector<Event> events{{INT_MAX,2},{INT_MIN,3},{INT_MAX,1}};
    std::ranges::sort(events, [](const Event& a, const Event& b){
        return a.sequence < b.sequence || (a.sequence==b.sequence && a.id<b.id);
    });
    if (events[0].sequence!=INT_MIN || events[1].id!=1 || events[2].id!=2)
        return EXIT_FAILURE;
    std::cout << "RANGE_SORT_NO_OVERFLOW_OK\n";
}` },
  ],
  "Exceções e guarantees": [
    { lang: "cpp", purpose: "Atualização copy-and-swap demonstra a garantia forte: falha de validação preserva o estado anterior.", code: `#include <cstdlib>
#include <iostream>
#include <stdexcept>
#include <string>
#include <utility>

class Profile {
    std::string name_;
public:
    explicit Profile(std::string name) : name_(std::move(name)) {}
    const std::string& name() const noexcept { return name_; }
    void rename(std::string candidate) {
        if (candidate.empty()) throw std::invalid_argument("empty name");
        name_.swap(candidate);
    }
};

int main() {
    Profile profile{"Ada"};
    try { profile.rename(""); } catch (const std::invalid_argument&) {}
    if (profile.name() != "Ada") return EXIT_FAILURE;
    profile.rename("Grace");
    if (profile.name() != "Grace") return EXIT_FAILURE;
    std::cout << "STRONG_GUARANTEE_OK\\n";
}` },
    { lang: "cpp", purpose: "Boundary noexcept converte exceções internas em código estável sem deixá-las atravessar a fronteira.", code: `#include <cstdlib>
#include <iostream>
#include <stdexcept>

enum class Status { ok, invalid, internal };
int parse_quantity(int raw) {
    if (raw <= 0) throw std::invalid_argument("quantity");
    return raw;
}
Status boundary(int raw, int& output) noexcept {
    try {
        output = parse_quantity(raw);
        return Status::ok;
    } catch (const std::invalid_argument&) {
        return Status::invalid;
    } catch (...) {
        return Status::internal;
    }
}
int main() {
    int output = 99;
    if (boundary(0, output) != Status::invalid || output != 99) return EXIT_FAILURE;
    if (boundary(4, output) != Status::ok || output != 4) return EXIT_FAILURE;
    std::cout << "NOEXCEPT_BOUNDARY_OK\\n";
}` },
  ],
  "expected, optional e status": [
    { lang: "cpp", purpose: "Outcome fechado preserva Created, Conflict e Unknown sem reduzir todos os casos a booleano.", code: `#include <cstdlib>
#include <iostream>
#include <string>
#include <type_traits>
#include <variant>

struct Created { std::string id; };
struct Conflict { std::string existing_id; };
struct Unknown { std::string reconciliation_key; };
using Outcome = std::variant<Created, Conflict, Unknown>;
std::string external_code(const Outcome& outcome) {
    return std::visit([](const auto& value) -> std::string {
        using T = std::decay_t<decltype(value)>;
        if constexpr (std::is_same_v<T, Created>) return "created:" + value.id;
        if constexpr (std::is_same_v<T, Conflict>) return "conflict:" + value.existing_id;
        return "unknown:" + value.reconciliation_key;
    }, outcome);
}
int main() {
    Outcome outcome = Unknown{"evt-42"};
    if (external_code(outcome) != "unknown:evt-42") return EXIT_FAILURE;
    std::cout << "RICH_OUTCOME_OK\\n";
}` },
    { lang: "cpp", purpose: "optional representa ausência legítima de cupom, enquanto quantidade inválida permanece erro distinto.", code: `#include <cstdlib>
#include <iostream>
#include <optional>
#include <string>
#include <variant>

struct Order { int quantity; std::optional<std::string> coupon; };
struct InvalidQuantity {};
using ParsedOrder = std::variant<Order, InvalidQuantity>;
ParsedOrder parse(int quantity, std::optional<std::string> coupon) {
    if (quantity <= 0) return InvalidQuantity{};
    return Order{quantity, std::move(coupon)};
}
int main() {
    auto no_coupon = parse(2, std::nullopt);
    auto invalid = parse(0, std::nullopt);
    if (!std::holds_alternative<Order>(no_coupon)) return EXIT_FAILURE;
    if (std::get<Order>(no_coupon).coupon.has_value()) return EXIT_FAILURE;
    if (!std::holds_alternative<InvalidQuantity>(invalid)) return EXIT_FAILURE;
    std::cout << "OPTIONAL_IS_NOT_ERROR_OK\\n";
}` },
  ],
  "Templates, concepts e constraints": [
    { lang: "cpp", purpose: "Concept limita o encoder a sinks de bytes e evita uma interface genérica sem contrato legível.", code: `#include <concepts>
#include <cstddef>
#include <cstdlib>
#include <iostream>
#include <span>
#include <vector>

template<class T>
concept ByteSink = requires(T sink, std::span<const std::byte> bytes) {
    { sink.append(bytes) } -> std::same_as<void>;
};
struct Buffer {
    std::vector<std::byte> data;
    void append(std::span<const std::byte> bytes) { data.insert(data.end(), bytes.begin(), bytes.end()); }
};
template<ByteSink Sink>
void encode_u16(Sink& sink, unsigned value) {
    const std::byte raw[2]{std::byte((value >> 8) & 0xff), std::byte(value & 0xff)};
    sink.append(raw);
}
int main() {
    Buffer buffer;
    encode_u16(buffer, 0x1234);
    if (buffer.data != std::vector<std::byte>{std::byte{0x12}, std::byte{0x34}}) return EXIT_FAILURE;
    std::cout << "CONSTRAINED_ENCODER_OK\\n";
}` },
    { lang: "cpp", purpose: "Quantity forte e factory validada impedem que inteiros negativos atravessem conversão genérica para size_t.", code: `#include <concepts>
#include <cstdlib>
#include <iostream>
#include <optional>

struct Quantity { std::size_t value; };
template<std::integral Integer>
std::optional<Quantity> make_quantity(Integer raw) {
    if constexpr (std::signed_integral<Integer>) {
        if (raw <= 0) return std::nullopt;
    } else if (raw == 0) {
        return std::nullopt;
    }
    return Quantity{static_cast<std::size_t>(raw)};
}
int main() {
    if (make_quantity(-1).has_value()) return EXIT_FAILURE;
    const auto quantity = make_quantity(7u);
    if (!quantity || quantity->value != 7) return EXIT_FAILURE;
    std::cout << "STRONG_QUANTITY_OK\\n";
}` },
  ],
  "Lambdas, captures e callbacks": [
    { lang: "cpp", purpose: "Callback adiado move dados próprios para a fila e não retém string_view do request encerrado.", code: `#include <cstdlib>
#include <functional>
#include <iostream>
#include <string>
#include <utility>

std::function<std::string()> delayed_job(std::string request_id) {
    return [id = std::move(request_id)] { return "processed:" + id; };
}
int main() {
    auto job = delayed_job(std::string{"req-73"});
    if (job() != "processed:req-73") return EXIT_FAILURE;
    std::cout << "OWNED_CAPTURE_OK\\n";
}` },
    { lang: "cpp", purpose: "weak_ptr impede uso tardio do serviço e o estado local aceita apenas uma completion concorrente.", code: `#include <atomic>
#include <cstdlib>
#include <iostream>
#include <memory>

struct Service { int accepted{0}; void accept() { ++accepted; } };
int main() {
    auto service = std::make_shared<Service>();
    std::weak_ptr<Service> weak = service;
    std::atomic_flag completed = ATOMIC_FLAG_INIT;
    auto completion = [&completed, weak] {
        if (completed.test_and_set()) return false;
        if (auto owner = weak.lock()) owner->accept();
        return true;
    };
    if (!completion() || completion() || service->accepted != 1) return EXIT_FAILURE;
    service.reset();
    if (!weak.expired()) return EXIT_FAILURE;
    std::cout << "WEAK_SINGLE_COMPLETION_OK\\n";
}` },
  ],
  "jthread, stop_token e lifecycle": [
    { lang: "cpp", purpose: "jthread recebe stop cooperativo, acorda periodicamente e é unido antes de o estado sair de escopo.", code: `#include <atomic>
#include <chrono>
#include <cstdlib>
#include <iostream>
#include <thread>

int main() {
    std::atomic<int> ticks{0};
    {
        std::jthread worker([&](std::stop_token stop) {
            while (!stop.stop_requested()) {
                ++ticks;
                std::this_thread::sleep_for(std::chrono::milliseconds(1));
            }
        });
        while (ticks.load() == 0) std::this_thread::yield();
        worker.request_stop();
    }
    if (ticks.load() == 0) return EXIT_FAILURE;
    std::cout << "JTHREAD_JOINED_OK\\n";
}` },
    { lang: "cpp", purpose: "stop_callback acorda o worker bloqueado e o predicado evita shutdown preso em fila vazia.", code: `#include <condition_variable>
#include <cstdlib>
#include <iostream>
#include <mutex>
#include <thread>

int main() {
    std::mutex mutex;
    std::condition_variable cv;
    bool exited = false;
    std::jthread worker([&](std::stop_token stop) {
        std::stop_callback wake{stop, [&]{ cv.notify_all(); }};
        std::unique_lock lock{mutex};
        cv.wait(lock, [&]{ return stop.stop_requested(); });
        exited = true;
    });
    worker.request_stop();
    worker.join();
    if (!exited) return EXIT_FAILURE;
    std::cout << "STOP_WAKES_WAIT_OK\\n";
}` },
  ],
  "Mutex, condition_variable e locks": [
    { lang: "cpp", purpose: "Check e decremento da última vaga acontecem na mesma região crítica.", code: `#include <cstdlib>
#include <iostream>
#include <mutex>
#include <thread>

class Capacity {
    int available_{1};
    std::mutex mutex_;
public:
    bool reserve() {
        std::lock_guard lock{mutex_};
        if (available_ == 0) return false;
        --available_;
        return true;
    }
};
int main() {
    Capacity capacity;
    bool a=false, b=false;
    std::thread first([&]{ a=capacity.reserve(); });
    std::thread second([&]{ b=capacity.reserve(); });
    first.join(); second.join();
    if (a == b) return EXIT_FAILURE;
    std::cout << "COMPOUND_INVARIANT_LOCKED_OK\\n";
}` },
    { lang: "cpp", purpose: "Fila espera com predicado, processa fora do lock e termina ao receber stop.", code: `#include <condition_variable>
#include <cstdlib>
#include <iostream>
#include <mutex>
#include <queue>
#include <thread>

int main() {
    std::mutex mutex; std::condition_variable cv; std::queue<int> queue;
    int consumed = 0; bool stopping = false;
    std::thread worker([&] {
        for (;;) {
            int item;
            { std::unique_lock lock{mutex};
              cv.wait(lock, [&]{ return stopping || !queue.empty(); });
              if (queue.empty() && stopping) return;
              item=queue.front(); queue.pop(); }
            consumed += item;
        }
    });
    { std::lock_guard lock{mutex}; queue.push(41); }
    cv.notify_one();
    { std::lock_guard lock{mutex}; stopping=true; }
    cv.notify_all(); worker.join();
    if (consumed != 41) return EXIT_FAILURE;
    std::cout << "PREDICATE_WAIT_OK\\n";
}` },
  ],
  "Atomics e modelo de memória": [
    { lang: "cpp", purpose: "CAS concede uma única transição Pending para Completed entre concorrentes.", code: `#include <atomic>
#include <cstdlib>
#include <iostream>
#include <thread>

enum class State { pending, completed };
int main() {
    std::atomic<State> state{State::pending};
    std::atomic<int> winners{0};
    auto complete = [&] {
        State expected=State::pending;
        if (state.compare_exchange_strong(expected, State::completed)) ++winners;
    };
    std::thread a{complete}, b{complete}; a.join(); b.join();
    if (winners.load()!=1 || state.load()!=State::completed) return EXIT_FAILURE;
    std::cout << "SINGLE_ATOMIC_TRANSITION_OK\\n";
}` },
    { lang: "cpp", purpose: "Release/acquire publica snapshot já construído e imutável ao leitor.", code: `#include <atomic>
#include <cstdlib>
#include <iostream>
#include <thread>

struct Snapshot { int quantity; int checksum; };
int main() {
    Snapshot snapshot{0,0};
    std::atomic<bool> ready{false};
    std::thread producer([&]{ snapshot={41,82}; ready.store(true,std::memory_order_release); });
    std::thread consumer([&]{
        while (!ready.load(std::memory_order_acquire)) std::this_thread::yield();
        if (snapshot.quantity*2 != snapshot.checksum) std::abort();
    });
    producer.join(); consumer.join();
    std::cout << "RELEASE_ACQUIRE_PUBLICATION_OK\\n";
}` },
  ],
  "Futures, coroutines e backpressure": [
    { lang: "cpp", purpose: "Fila bounded recusa admissão acima da capacidade antes de prometer processamento.", code: `#include <cstdlib>
#include <deque>
#include <iostream>
#include <optional>

class BoundedQueue {
    std::deque<int> items_; std::size_t limit_;
public:
    explicit BoundedQueue(std::size_t limit):limit_(limit){}
    bool try_push(int value) {
        if (items_.size() >= limit_) return false;
        items_.push_back(value); return true;
    }
    std::size_t size() const { return items_.size(); }
};
int main() {
    BoundedQueue queue{2};
    if (!queue.try_push(1) || !queue.try_push(2) || queue.try_push(3) || queue.size()!=2)
        return EXIT_FAILURE;
    std::cout << "BOUNDED_ADMISSION_OK\\n";
}` },
    { lang: "cpp", purpose: "Promise propaga exception ao consumidor e o resultado só pode ser consumido uma vez.", code: `#include <cstdlib>
#include <future>
#include <iostream>
#include <stdexcept>
#include <thread>

int main() {
    std::promise<int> promise;
    auto result=promise.get_future();
    std::thread worker([p=std::move(promise)]() mutable {
        try { throw std::runtime_error("provider failed"); }
        catch (...) { p.set_exception(std::current_exception()); }
    });
    bool observed=false;
    try { (void)result.get(); } catch (const std::runtime_error&) { observed=true; }
    worker.join();
    if (!observed) return EXIT_FAILURE;
    std::cout << "FUTURE_EXCEPTION_OBSERVED_OK\\n";
}` },
  ],
  "Filesystem e escrita recuperável": [
    { lang: "cpp", purpose: "Path lógico é rejeitado quando absoluto ou contém componente de subida antes de tocar o filesystem.", code: `#include <cstdlib>
#include <filesystem>
#include <iostream>

bool safe_relative(const std::filesystem::path& path) {
    if (path.empty() || path.is_absolute()) return false;
    for (const auto& part : path) if (part == "..") return false;
    return true;
}
int main() {
    if (!safe_relative("tenant/snapshot.bin")) return EXIT_FAILURE;
    if (safe_relative("../secret") || safe_relative("/absolute")) return EXIT_FAILURE;
    std::cout << "LOGICAL_PATH_VALIDATED_OK\\n";
}` },
    { lang: "cpp", purpose: "Envelope local valida magic, versão, tamanho e checksum antes de publicar payload.", code: `#include <cstdint>
#include <cstdlib>
#include <iostream>
#include <span>
#include <vector>

bool valid(std::span<const std::uint8_t> bytes) {
    if (bytes.size()!=6 || bytes[0]!='Q' || bytes[1]!=1 || bytes[2]!=2) return false;
    return static_cast<std::uint8_t>(bytes[3]+bytes[4])==bytes[5];
}
int main() {
    std::vector<std::uint8_t> good{'Q',1,2,20,21,41};
    auto corrupt=good; corrupt[4]=22;
    if (!valid(good) || valid(corrupt)) return EXIT_FAILURE;
    std::cout << "FILE_ENVELOPE_VALIDATED_OK\\n";
}` },
  ],
  "Streams, parsing e locale": [
    { lang: "cpp", purpose: "from_chars aceita apenas inteiro positivo que consome toda a entrada e preserva output na falha.", code: `#include <charconv>
#include <cstdlib>
#include <iostream>
#include <string_view>

bool parse_quantity(std::string_view input, int& output) {
    int candidate{};
    const auto result=std::from_chars(input.data(),input.data()+input.size(),candidate);
    if (result.ec!=std::errc{} || result.ptr!=input.data()+input.size() || candidate<=0) return false;
    output=candidate; return true;
}
int main() {
    int value=9;
    if (parse_quantity("3x",value) || value!=9) return EXIT_FAILURE;
    if (!parse_quantity("41",value) || value!=41) return EXIT_FAILURE;
    std::cout << "TOTAL_PARSE_OK\\n";
}` },
    { lang: "cpp", purpose: "Parser incremental possui storage próprio e só publica frame quando comprimento completo chegou.", code: `#include <cstddef>
#include <cstdlib>
#include <iostream>
#include <optional>
#include <string>

class FrameParser {
    std::string buffer_;
public:
    std::optional<std::string> feed(std::string chunk) {
        buffer_ += chunk;
        if (buffer_.size()<1) return std::nullopt;
        const auto length=static_cast<unsigned char>(buffer_[0]);
        if (length>8 || buffer_.size()!=length+1) return std::nullopt;
        return buffer_.substr(1);
    }
};
int main() {
    FrameParser parser;
    if (parser.feed(std::string{"\\x03"} + "ab")) return EXIT_FAILURE;
    auto frame=parser.feed("c");
    if (!frame || *frame!="abc") return EXIT_FAILURE;
    std::cout << "INCREMENTAL_OWNED_PARSE_OK\\n";
}` },
  ],
  "Formatos e schemas versionados": [
    { lang: "cpp", purpose: "Encoder escreve u32 em ordem de rede, independente de padding e layout do objeto C++.", code: `#include <array>
#include <cstdint>
#include <cstdlib>
#include <iostream>

std::array<std::uint8_t,4> encode_u32(std::uint32_t value) {
    return {std::uint8_t(value>>24),std::uint8_t(value>>16),std::uint8_t(value>>8),std::uint8_t(value)};
}
int main() {
    if (encode_u32(0x12345678u)!=std::array<std::uint8_t,4>{0x12,0x34,0x56,0x78}) return EXIT_FAILURE;
    std::cout << "CANONICAL_ENDIAN_OK\\n";
}` },
    { lang: "cpp", purpose: "Leitor de versão futura falha fechado sem mapear estado desconhecido para sucesso.", code: `#include <cstdint>
#include <cstdlib>
#include <iostream>
#include <optional>
#include <span>

enum class Status : std::uint8_t { pending=1, confirmed=2 };
std::optional<Status> decode(std::uint8_t version,std::uint8_t raw) {
    if (version!=1) return std::nullopt;
    if (raw==1) return Status::pending;
    if (raw==2) return Status::confirmed;
    return std::nullopt;
}
int main() {
    if (!decode(1,2) || decode(2,2) || decode(1,99)) return EXIT_FAILURE;
    std::cout << "UNKNOWN_SCHEMA_CLOSED_OK\\n";
}` },
  ],
  "HTTP, TLS e retries": [
    { lang: "cpp", purpose: "Retry conserva eventId e classifica timeout pós-envio como Unknown para reconciliação.", code: `#include <cstdlib>
#include <iostream>
#include <string>

enum class Outcome { created, unknown };
struct Attempt { std::string event_id; bool sent; bool response; };
Outcome classify(const Attempt& attempt) {
    return attempt.sent && !attempt.response ? Outcome::unknown : Outcome::created;
}
int main() {
    Attempt first{"evt-41",true,false};
    Attempt retry{first.event_id,true,true};
    if (classify(first)!=Outcome::unknown || retry.event_id!="evt-41") return EXIT_FAILURE;
    std::cout << "STABLE_RETRY_ID_OK\\n";
}` },
    { lang: "cpp", purpose: "Backoff é limitado por budget e Retry-After hostil não pode impor espera ilimitada.", code: `#include <algorithm>
#include <chrono>
#include <cstdlib>
#include <iostream>

std::chrono::seconds bounded_delay(int attempt,std::chrono::seconds retry_after) {
    const auto exponential=std::chrono::seconds{1 << std::min(attempt,5)};
    return std::min({exponential,retry_after,std::chrono::seconds{30}});
}
int main() {
    if (bounded_delay(10,std::chrono::seconds{999})!=std::chrono::seconds{30}) return EXIT_FAILURE;
    if (bounded_delay(2,std::chrono::seconds{3})!=std::chrono::seconds{3}) return EXIT_FAILURE;
    std::cout << "RETRY_BUDGET_BOUNDED_OK\\n";
}` },
  ],
  "Headers, ODR e linkage": [
    { lang: "cpp", purpose: "Header autocontido usa função inline sem estado divergente entre translation units.", code: `#include <cstdlib>
#include <iostream>
#include <string_view>

inline constexpr std::string_view protocol_version() noexcept { return "chiron/1"; }
int consumer_a() { return protocol_version().size(); }
int consumer_b() { return protocol_version()[0]=='c'; }
int main() {
    if (consumer_a()!=8 || consumer_b()!=1) return EXIT_FAILURE;
    std::cout << "INLINE_DEFINITION_COHERENT_OK\\n";
}` },
    { lang: "cpp", purpose: "Estado compartilhado usa accessor local-static em vez de cópia static por consumidor.", code: `#include <cstdlib>
#include <iostream>

int& registry_count() { static int count=0; return count; }
void consumer_a() { ++registry_count(); }
void consumer_b() { ++registry_count(); }
int main() {
    consumer_a(); consumer_b();
    if (registry_count()!=2) return EXIT_FAILURE;
    std::cout << "ONE_REGISTRY_IDENTITY_OK\\n";
}` },
  ],
  "CMake, presets e dependências": [
    { lang: "cpp", purpose: "Programa C++20 representa o consumer mínimo que um pacote CMake instalado deve conseguir construir.", code: `#include <concepts>
#include <cstdlib>
#include <iostream>

template<std::integral T> T twice(T value) { return value+value; }
int main() {
    static_assert(__cplusplus>=202002L);
    if (twice(21)!=42) return EXIT_FAILURE;
    std::cout << "INSTALLED_CONSUMER_BASELINE_OK\\n";
}` },
    { lang: "cpp", purpose: "Artefato reporta apenas metadados bounded que o build deve injetar de forma reproduzível.", code: `#include <cstdlib>
#include <iostream>
#include <string_view>

#ifndef CHIRON_BUILD_VERSION
#define CHIRON_BUILD_VERSION "dev-unverified"
#endif
int main() {
    constexpr std::string_view version=CHIRON_BUILD_VERSION;
    if (version.empty()) return EXIT_FAILURE;
    std::cout << "BUILD_VERSION=" << version << '\\n';
}` },
  ],
  "Módulos e fronteiras": [
    { lang: "cpp", purpose: "Fronteira equivalente a módulo retorna value owned em vez de view para storage temporário.", code: `#include <cstdlib>
#include <iostream>
#include <string>
#include <string_view>

std::string normalize_id(std::string_view input) { return std::string{input}; }
int main() {
    std::string owned;
    { std::string temporary="evt-41"; owned=normalize_id(temporary); }
    if (owned!="evt-41") return EXIT_FAILURE;
    std::cout << "MODULE_BOUNDARY_OWNS_VALUE_OK\\n";
}` },
    { lang: "cpp", purpose: "Capability explícita permite recusar consumidor que pede versão futura da interface.", code: `#include <cstdlib>
#include <iostream>
#include <optional>

struct Capability { unsigned api_version; bool modules; };
std::optional<Capability> negotiate(unsigned requested) {
    if (requested>1) return std::nullopt;
    return Capability{1,true};
}
int main() {
    if (!negotiate(1) || negotiate(2)) return EXIT_FAILURE;
    std::cout << "MODULE_CAPABILITY_CLOSED_OK\\n";
}` },
  ],
  "Bibliotecas, ABI e FFI C": [
    { lang: "cpp", purpose: "Boundary C opaca captura exceptions e retorna código estável sem expor classe C++.", code: `#include <cstdlib>
#include <iostream>
#include <memory>
#include <new>

struct chiron_handle { int value; };
extern "C" int chiron_create(chiron_handle** out) noexcept {
    if (!out) return 1;
    *out=nullptr;
    try { *out=new chiron_handle{41}; return 0; }
    catch (...) { return 2; }
}
extern "C" void chiron_destroy(chiron_handle* handle) noexcept { delete handle; }
int main() {
    chiron_handle* handle=nullptr;
    if (chiron_create(&handle)!=0 || !handle || handle->value!=41) return EXIT_FAILURE;
    chiron_destroy(handle);
    std::cout << "OPAQUE_C_BOUNDARY_OK\\n";
}` },
    { lang: "cpp", purpose: "Saída pointer+length informa tamanho requerido e nunca retorna c_str de objeto temporário.", code: `#include <algorithm>
#include <cstddef>
#include <cstdlib>
#include <cstring>
#include <iostream>
#include <string_view>

extern "C" std::size_t chiron_version(char* out,std::size_t capacity) noexcept {
    constexpr std::string_view value="chiron-1";
    const std::size_t required=value.size()+1;
    if (!out || capacity<required) return required;
    std::memcpy(out,value.data(),value.size()); out[value.size()]='\\0';
    return required;
}
int main() {
    char buffer[16]{};
    if (chiron_version(nullptr,0)!=9 || chiron_version(buffer,sizeof buffer)!=9) return EXIT_FAILURE;
    if (std::string_view{buffer}!="chiron-1") return EXIT_FAILURE;
    std::cout << "FFI_BUFFER_CONTRACT_OK\\n";
}` },
  ],
  "Unit, property e mutation testing": [
    { lang: "cpp", purpose: "Property determinística valida round-trip em toda faixa pequena e rejeita trailing input.", code: `#include <charconv>
#include <cstdlib>
#include <iostream>
#include <string>

bool parse(const std::string& text,int& out) {
    int candidate{}; auto r=std::from_chars(text.data(),text.data()+text.size(),candidate);
    if (r.ec!=std::errc{} || r.ptr!=text.data()+text.size()) return false;
    out=candidate; return true;
}
int main() {
    for (int value=-1000; value<=1000; ++value) {
        int decoded{}; if (!parse(std::to_string(value),decoded) || decoded!=value) return EXIT_FAILURE;
    }
    int out{}; if (parse("41x",out)) return EXIT_FAILURE;
    std::cout << "PARSE_PROPERTY_OK\\n";
}` },
    { lang: "cpp", purpose: "Oráculo mata mutante que confirma reserva sem registrar outbox na mesma operação local.", code: `#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>

struct Store { int capacity{1}; std::vector<std::string> outbox; };
bool reserve(Store& store,const std::string& event) {
    if (store.capacity==0) return false;
    --store.capacity; store.outbox.push_back(event); return true;
}
int main() {
    Store store;
    if (!reserve(store,"evt-41") || store.capacity!=0 || store.outbox!=std::vector<std::string>{"evt-41"})
        return EXIT_FAILURE;
    std::cout << "STATE_AND_EFFECT_ORACLE_OK\\n";
}` },
  ],
  "Sanitizers e static analysis": [
    { lang: "cpp", purpose: "Callback adiado possui string própria, cenário que ASan pode contrastar com captura dangling.", code: `#include <cstdlib>
#include <functional>
#include <iostream>
#include <string>

std::function<std::string()> make_job(std::string input) {
    return [owned=std::move(input)] { return owned; };
}
int main() {
    auto job=make_job("payload-owned");
    if (job()!="payload-owned") return EXIT_FAILURE;
    std::cout << "SANITIZER_LIFETIME_FIXTURE_OK\\n";
}` },
    { lang: "cpp", purpose: "Checked addition evita executar overflow signed que UBSan apenas diagnosticaria em teste.", code: `#include <cstdlib>
#include <iostream>
#include <limits>
#include <optional>

std::optional<int> checked_add(int a,int b) {
    if (b>0 && a>std::numeric_limits<int>::max()-b) return std::nullopt;
    if (b<0 && a<std::numeric_limits<int>::min()-b) return std::nullopt;
    return a+b;
}
int main() {
    if (checked_add(std::numeric_limits<int>::max(),1)) return EXIT_FAILURE;
    if (checked_add(20,21)!=41) return EXIT_FAILURE;
    std::cout << "CHECKED_ARITHMETIC_OK\\n";
}` },
  ],
  "Profiling, allocation e cache": [
    { lang: "cpp", purpose: "Cache key inclui tenant e entidade, impedindo colisão lógica entre clientes.", code: `#include <cstdlib>
#include <iostream>
#include <map>
#include <string>
#include <tuple>

struct Key { std::string tenant; std::string id; auto operator<=>(const Key&) const=default; };
int main() {
    std::map<Key,std::string> cache;
    cache[{"alpha","r1"}]="A"; cache[{"beta","r1"}]="B";
    if (cache.size()!=2 || cache[{"alpha","r1"}]==cache[{"beta","r1"}]) return EXIT_FAILURE;
    std::cout << "TENANT_SCOPED_CACHE_OK\\n";
}` },
    { lang: "cpp", purpose: "Benchmark checksum mantém trabalho observável sem sacrificar verificação de resultado.", code: `#include <cstdlib>
#include <iostream>
#include <numeric>
#include <vector>

int main() {
    std::vector<int> values(1000); std::iota(values.begin(),values.end(),1);
    const auto checksum=std::accumulate(values.begin(),values.end(),0LL);
    if (checksum!=500500) return EXIT_FAILURE;
    std::cout << "OBSERVABLE_BENCHMARK_RESULT_OK\\n";
}` },
  ],
  "Undefined behavior e portability": [
    { lang: "cpp", purpose: "Decode byte a byte funciona com buffer desalinhado e não reinterpreta layout de struct.", code: `#include <cstdint>
#include <cstdlib>
#include <iostream>
#include <span>

std::uint32_t decode_be(std::span<const std::uint8_t,4> bytes) {
    return (std::uint32_t(bytes[0])<<24)|(std::uint32_t(bytes[1])<<16)|
           (std::uint32_t(bytes[2])<<8)|std::uint32_t(bytes[3]);
}
int main() {
    std::uint8_t storage[]{0,0x12,0x34,0x56,0x78};
    if (decode_be(std::span<const std::uint8_t,4>{storage+1,4})!=0x12345678u) return EXIT_FAILURE;
    std::cout << "PORTABLE_UNALIGNED_DECODE_OK\\n";
}` },
    { lang: "cpp", purpose: "Conversão signed para tamanho só ocorre depois de validar domínio e faixa.", code: `#include <cstdlib>
#include <iostream>
#include <optional>

std::optional<std::size_t> checked_size(long long raw,std::size_t limit) {
    if (raw<0 || static_cast<unsigned long long>(raw)>limit) return std::nullopt;
    return static_cast<std::size_t>(raw);
}
int main() {
    if (checked_size(-1,100) || checked_size(101,100)) return EXIT_FAILURE;
    if (checked_size(41,100)!=41u) return EXIT_FAILURE;
    std::cout << "PORTABLE_SIZE_CONVERSION_OK\\n";
}` },
  ],
  "Value objects e aggregate": [
    { lang: "cpp", purpose: "Tipos fortes impedem trocar tenant e reserva, enquanto factory rejeita quantidade fora do domínio.", code: `#include <cstdlib>
#include <iostream>
#include <optional>
#include <string>

struct TenantId { std::string value; };
struct ReservationId { std::string value; };
class Quantity {
    unsigned value_;
    explicit Quantity(unsigned value):value_(value){}
public:
    static std::optional<Quantity> create(long long raw) {
        if (raw<1 || raw>1000) return std::nullopt;
        return Quantity{static_cast<unsigned>(raw)};
    }
    unsigned value() const { return value_; }
};
int main() {
    TenantId tenant{"tenant-a"}; ReservationId reservation{"res-1"};
    auto quantity=Quantity::create(41);
    if (!quantity || quantity->value()!=41 || tenant.value==reservation.value) return EXIT_FAILURE;
    std::cout << "STRONG_DOMAIN_VALUES_OK\\n";
}` },
    { lang: "cpp", purpose: "Aggregate produz evento owned somente após transição válida e preserva invariantes em rejeição.", code: `#include <cstdlib>
#include <iostream>
#include <optional>
#include <string>

struct Reserved { std::string event_id; unsigned quantity; };
class Reservation {
    unsigned remaining_{1};
public:
    std::optional<Reserved> reserve(std::string event_id,unsigned quantity) {
        if (quantity==0 || quantity>remaining_) return std::nullopt;
        remaining_-=quantity; return Reserved{std::move(event_id),quantity};
    }
    unsigned remaining() const { return remaining_; }
};
int main() {
    Reservation aggregate;
    if (aggregate.reserve("bad",2) || aggregate.remaining()!=1) return EXIT_FAILURE;
    auto event=aggregate.reserve("evt-41",1);
    if (!event || event->event_id!="evt-41" || aggregate.remaining()!=0) return EXIT_FAILURE;
    std::cout << "AGGREGATE_TRANSITION_OK\\n";
}` },
  ],
  "SQL parametrizado e RAII": [
    { lang: "cpp", purpose: "Wrapper move-only modela transaction que faz rollback automático enquanto commit permanece explícito.", code: `#include <cstdlib>
#include <iostream>

struct FakeConnection { bool open_tx=false; bool committed=false; };
class Transaction {
    FakeConnection* connection_;
public:
    explicit Transaction(FakeConnection& c):connection_(&c){ c.open_tx=true; }
    Transaction(const Transaction&)=delete;
    Transaction& operator=(const Transaction&)=delete;
    ~Transaction(){ if (connection_ && connection_->open_tx) connection_->open_tx=false; }
    bool commit(){ connection_->committed=true; connection_->open_tx=false; return true; }
};
int main() {
    FakeConnection c;
    { Transaction transaction{c}; if (!transaction.commit()) return EXIT_FAILURE; }
    if (c.open_tx || !c.committed) return EXIT_FAILURE;
    std::cout << "TRANSACTION_RAII_OK\\n";
}` },
    { lang: "cpp", purpose: "Statement fake registra template e valores separadamente para ensinar binding sem alegar engine real.", code: `#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>

struct BoundStatement { std::string sql; std::vector<std::string> values; };
BoundStatement reservation_insert(std::string tenant,std::string id) {
    return {"INSERT INTO reservation(tenant_id,id) VALUES (?,?)",{std::move(tenant),std::move(id)}};
}
int main() {
    auto statement=reservation_insert("tenant'a","res-41");
    if (statement.sql.find("tenant'a")!=std::string::npos || statement.values[0]!="tenant'a") return EXIT_FAILURE;
    std::cout << "VALUES_BOUND_SEPARATELY_OK\\n";
}` },
  ],
  "Concorrência, constraints e isolation": [
    { lang: "cpp", purpose: "Modelo local de update condicional concede uma única última vaga sem check separado.", code: `#include <atomic>
#include <cstdlib>
#include <iostream>
#include <thread>

int main() {
    std::atomic<int> available{1}; std::atomic<int> successes{0};
    auto reserve=[&]{
        int expected=available.load();
        while (expected>0 && !available.compare_exchange_weak(expected,expected-1)) {}
        if (expected>0) ++successes;
    };
    std::thread a{reserve},b{reserve}; a.join(); b.join();
    if (successes!=1 || available!=0) return EXIT_FAILURE;
    std::cout << "LOCAL_CONDITIONAL_UPDATE_MODEL_OK\\n";
}` },
    { lang: "cpp", purpose: "Fingerprint inclui tenant e payload para distinguir replay de conflito.", code: `#include <cstdlib>
#include <iostream>
#include <map>
#include <string>

enum class Result { created,replayed,conflict };
Result apply(std::map<std::string,std::string>& intents,const std::string& key,const std::string& fingerprint) {
    auto [it,inserted]=intents.emplace(key,fingerprint);
    if (inserted) return Result::created;
    return it->second==fingerprint ? Result::replayed : Result::conflict;
}
int main() {
    std::map<std::string,std::string> intents;
    if (apply(intents,"tenant-a:key-1","q=1")!=Result::created) return EXIT_FAILURE;
    if (apply(intents,"tenant-a:key-1","q=1")!=Result::replayed) return EXIT_FAILURE;
    if (apply(intents,"tenant-a:key-1","q=2")!=Result::conflict) return EXIT_FAILURE;
    std::cout << "REPLAY_OR_CONFLICT_OK\\n";
}` },
  ],
  "Outbox e idempotência": [
    { lang: "cpp", purpose: "Commit local modela domínio e outbox como uma unidade antes de qualquer envio externo.", code: `#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>

struct State { int capacity{1}; std::vector<std::string> outbox; };
bool commit_reservation(State& state,const std::string& event) {
    if (state.capacity==0) return false;
    State candidate=state; --candidate.capacity; candidate.outbox.push_back(event);
    state=std::move(candidate); return true;
}
int main() {
    State state;
    if (!commit_reservation(state,"evt-41") || state.capacity!=0 || state.outbox.size()!=1) return EXIT_FAILURE;
    std::cout << "LOCAL_OUTBOX_ATOMIC_MODEL_OK\\n";
}` },
    { lang: "cpp", purpose: "State machine conserva eventId quando envio aplicado perde resposta e segue para reconciliação.", code: `#include <cstdlib>
#include <iostream>
#include <string>

enum class Delivery { pending,unknown,sent };
struct Event { std::string id; Delivery state{Delivery::pending}; };
void response_lost_after_send(Event& event) { event.state=Delivery::unknown; }
void reconcile_applied(Event& event,const std::string& observed_id) {
    if (event.id==observed_id && event.state==Delivery::unknown) event.state=Delivery::sent;
}
int main() {
    Event event{"evt-41"}; response_lost_after_send(event); reconcile_applied(event,"evt-41");
    if (event.state!=Delivery::sent || event.id!="evt-41") return EXIT_FAILURE;
    std::cout << "OUTBOX_RECONCILIATION_MODEL_OK\\n";
}` },
  ],
  "Ports, adapters e dependency injection": [
    { lang: "cpp", purpose: "Service recebe port obrigatório por referência e mantém política separada do adapter.", code: `#include <cstdlib>
#include <iostream>
#include <string>

enum class SaveResult { created,conflict,unknown };
struct ReservationPort { virtual ~ReservationPort()=default; virtual SaveResult save(const std::string&)=0; };
class Service {
    ReservationPort& port_;
public:
    explicit Service(ReservationPort& port):port_(port){}
    SaveResult reserve(const std::string& event_id){ return port_.save(event_id); }
};
struct FakePort final:ReservationPort { SaveResult save(const std::string&) override{return SaveResult::created;} };
int main(){ FakePort port; Service service{port}; if(service.reserve("evt-41")!=SaveResult::created)return EXIT_FAILURE; std::cout<<"INJECTED_PORT_OK\\n"; }` },
    { lang: "cpp", purpose: "Outcome do adapter preserva Unknown em vez de reduzir falha pós-commit a false.", code: `#include <cstdlib>
#include <iostream>
#include <variant>

struct Created{}; struct Conflict{}; struct Unknown{};
using Outcome=std::variant<Created,Conflict,Unknown>;
Outcome map_commit_result(bool request_sent,bool response_received){
    if(request_sent&&!response_received)return Unknown{};
    return Created{};
}
int main(){ if(!std::holds_alternative<Unknown>(map_commit_result(true,false)))return EXIT_FAILURE; std::cout<<"ADAPTER_UNKNOWN_PRESERVED_OK\\n"; }` },
  ],
  "Logging, metrics e tracing": [
    { lang: "cpp", purpose: "Logger estruturado aceita somente campos bounded e redige Authorization antes do sink.", code: `#include <cstdlib>
#include <iostream>
#include <map>
#include <string>

std::map<std::string,std::string> safe_fields(std::map<std::string,std::string> input){
    if(input.contains("authorization"))input["authorization"]="[REDACTED]";
    input.erase("body"); return input;
}
int main(){ auto fields=safe_fields({{"operation","reserve"},{"authorization","Bearer secret"},{"body","private"}}); if(fields["authorization"]!="[REDACTED]"||fields.contains("body"))return EXIT_FAILURE; std::cout<<"STRUCTURED_REDACTION_OK\\n"; }` },
    { lang: "cpp", purpose: "Métrica rejeita labels de alta cardinalidade e mantém conjunto enumerado.", code: `#include <cstdlib>
#include <iostream>
#include <set>
#include <string>

bool allowed_label(const std::string& name){ static const std::set<std::string> allowed{"operation","outcome","provider"}; return allowed.contains(name); }
int main(){ if(!allowed_label("outcome")||allowed_label("request_id")||allowed_label("tenant_id"))return EXIT_FAILURE; std::cout<<"BOUNDED_METRIC_LABELS_OK\\n"; }` },
  ],
  "Config, secrets e privilege": [
    { lang: "cpp", purpose: "Parser de configuração exige inteiro completo e faixa segura, sem atoi silencioso.", code: `#include <charconv>
#include <cstdlib>
#include <iostream>
#include <optional>
#include <string_view>

std::optional<int> parse_timeout(std::string_view raw){ int value{}; auto r=std::from_chars(raw.data(),raw.data()+raw.size(),value); if(r.ec!=std::errc{}||r.ptr!=raw.data()+raw.size()||value<100||value>30000)return std::nullopt; return value; }
int main(){ if(parse_timeout("oops")||parse_timeout("0")||parse_timeout("200x")||parse_timeout("500")!=500)return EXIT_FAILURE; std::cout<<"CONFIG_RANGE_VALIDATED_OK\\n"; }` },
    { lang: "cpp", purpose: "Snapshot de segredo owned mantém lifetime da operação sem expor valor no formatter.", code: `#include <cstdlib>
#include <iostream>
#include <string>

class Secret { std::string value_; public: explicit Secret(std::string value):value_(std::move(value)){} const std::string& use()const{return value_;} std::string describe()const{return "[REDACTED]";} };
int main(){ Secret token{"synthetic-token"}; if(token.use()!="synthetic-token"||token.describe().find("synthetic")!=std::string::npos)return EXIT_FAILURE; std::cout<<"SECRET_REDACTION_OK\\n"; }` },
  ],
  "Health, overload e degradation": [
    { lang: "cpp", purpose: "Readiness reflete storage, schema, admissão e capacidade em vez de constante saudável.", code: `#include <cstdlib>
#include <iostream>

struct Health { bool storage; bool schema; bool accepting; unsigned queue; unsigned limit; };
bool ready(const Health& h){ return h.storage&&h.schema&&h.accepting&&h.queue<h.limit; }
int main(){ if(!ready({true,true,true,1,2})||ready({false,true,true,0,2})||ready({true,true,true,2,2}))return EXIT_FAILURE; std::cout<<"READINESS_REFLECTS_CAPACITY_OK\\n"; }` },
    { lang: "cpp", purpose: "Admissão bounded recusa antes de enfileirar e preserva memória sob overload.", code: `#include <cstdlib>
#include <deque>
#include <iostream>

class Admission { std::deque<int> queue_; std::size_t limit_; public: explicit Admission(std::size_t n):limit_(n){} bool accept(int job){ if(queue_.size()>=limit_)return false; queue_.push_back(job); return true; } std::size_t size()const{return queue_.size();} };
int main(){ Admission admission{2}; if(!admission.accept(1)||!admission.accept(2)||admission.accept(3)||admission.size()!=2)return EXIT_FAILURE; std::cout<<"OVERLOAD_REJECTED_BEFORE_QUEUE_OK\\n"; }` },
  ],
  "Packaging e runtime dependencies": [
    { lang: "cpp", purpose: "Artefato expõe versão e ABI esperadas para smoke test do pacote instalado.", code: `#include <cstdlib>
#include <iostream>
#include <string_view>

struct ArtifactIdentity { std::string_view version; unsigned abi; };
constexpr ArtifactIdentity identity(){ return {"1.0.0",1}; }
int main(){ constexpr auto id=identity(); static_assert(id.abi==1); if(id.version!="1.0.0")return EXIT_FAILURE; std::cout<<"INSTALLED_ARTIFACT_ID_OK\\n"; }` },
    { lang: "cpp", purpose: "Manifest local exige hashes não vazios e target conhecido antes da ativação.", code: `#include <cstdlib>
#include <iostream>
#include <string>

struct Manifest { std::string artifact_hash; std::string target; unsigned schema; };
bool valid(const Manifest& m){ return m.artifact_hash.size()==64 && (m.target=="windows-x64"||m.target=="linux-x64") && m.schema==1; }
int main(){ Manifest good{std::string(64,'a'),"windows-x64",1}; Manifest bad{"latest","windows-x64",1}; if(!valid(good)||valid(bad))return EXIT_FAILURE; std::cout<<"PACKAGE_MANIFEST_VALIDATED_OK\\n"; }` },
  ],
  "Shutdown, signals e cancellation": [
    { lang: "cpp", purpose: "Shutdown fecha admissão antes de pedir stop e junta worker antes de destruir estado.", code: `#include <atomic>
#include <cstdlib>
#include <iostream>
#include <thread>

int main(){ std::atomic<bool> accepting{true}; std::atomic<bool> exited{false}; std::jthread worker([&](std::stop_token stop){ while(!stop.stop_requested())std::this_thread::yield(); exited=true; }); accepting=false; worker.request_stop(); worker.join(); if(accepting||!exited)return EXIT_FAILURE; std::cout<<"ORDERED_SHUTDOWN_OK\\n"; }` },
    { lang: "cpp", purpose: "Cancel pós-commit preserva evento durável em estado Unknown em vez de apagá-lo.", code: `#include <cstdlib>
#include <iostream>
#include <string>

enum class Phase{before_commit,committed,unknown};
struct Work{std::string event_id; Phase phase{Phase::before_commit};};
void commit(Work& w){w.phase=Phase::committed;}
void cancel_after_send(Work& w){if(w.phase==Phase::committed)w.phase=Phase::unknown;}
int main(){Work w{"evt-41"};commit(w);cancel_after_send(w);if(w.phase!=Phase::unknown||w.event_id!="evt-41")return EXIT_FAILURE;std::cout<<"CANCEL_PRESERVES_IDENTITY_OK\\n";}` },
  ],
  "Migrations, rollout e compatibility": [
    { lang: "cpp", purpose: "Reader novo aceita evento antigo e rejeita versão futura sem default de sucesso.", code: `#include <cstdlib>
#include <iostream>
#include <optional>

enum class Status{pending,confirmed};
std::optional<Status> read(unsigned version,unsigned raw){ if(version==1&&raw<=1)return raw?Status::confirmed:Status::pending; if(version==2&&raw<=1)return raw?Status::confirmed:Status::pending; return std::nullopt; }
int main(){if(!read(1,1)||!read(2,0)||read(3,1)||read(2,99))return EXIT_FAILURE;std::cout<<"OLD_NEW_READER_MATRIX_OK\\n";}` },
    { lang: "cpp", purpose: "Operação captura uma versão de feature flag e não muda de política no meio da transação.", code: `#include <cstdlib>
#include <iostream>

struct ConfigSnapshot{unsigned policy_version;bool new_writer;};
unsigned execute(const ConfigSnapshot snapshot){const unsigned before=snapshot.policy_version;const unsigned after=snapshot.policy_version;return before==after&&snapshot.new_writer?2:1;}
int main(){ConfigSnapshot current{7,true};if(execute(current)!=2)return EXIT_FAILURE;current={8,false};if(execute(current)!=1)return EXIT_FAILURE;std::cout<<"OPERATION_CONFIG_SNAPSHOT_OK\\n";}` },
  ],
  "Backup, restore e incident response": [
    { lang: "cpp", purpose: "Restore valida manifest e preserva eventId para reconciliação sem criar nova identidade.", code: `#include <cstdlib>
#include <iostream>
#include <string>
#include <vector>

struct Backup{unsigned schema;std::string checksum;std::vector<std::string> pending_ids;};
bool restoreable(const Backup& b){return b.schema==1&&b.checksum.size()==64&&!b.pending_ids.empty();}
int main(){Backup backup{1,std::string(64,'b'),{"evt-41"}};if(!restoreable(backup)||backup.pending_ids[0]!="evt-41")return EXIT_FAILURE;std::cout<<"RESTORE_PRESERVES_EVENT_ID_OK\\n";}` },
    { lang: "cpp", purpose: "Reconciliação classifica Applied, NotApplied e Unknown antes de qualquer replay.", code: `#include <cstdlib>
#include <iostream>

enum class Observation{applied,not_applied,unknown};
enum class Action{mark_sent,retry_same_id,manual_review};
Action reconcile(Observation o){switch(o){case Observation::applied:return Action::mark_sent;case Observation::not_applied:return Action::retry_same_id;case Observation::unknown:return Action::manual_review;}return Action::manual_review;}
int main(){if(reconcile(Observation::applied)!=Action::mark_sent||reconcile(Observation::unknown)!=Action::manual_review)return EXIT_FAILURE;std::cout<<"RESTORE_RECONCILIATION_CLOSED_OK\\n";}` },
  ],
  "API e modelo de domínio": [
    { lang: "cpp", purpose: "API usa tipos fortes e outcome fechado sem confiar em tenant enviado no corpo.", code: `#include <cstdlib>
#include <iostream>
#include <string>
#include <variant>

struct TenantId{std::string value;}; struct Created{std::string reservation_id;}; struct Conflict{}; struct SoldOut{};
using Outcome=std::variant<Created,Conflict,SoldOut>;
Outcome reserve(const TenantId& authenticated,unsigned quantity){ if(authenticated.value.empty())return Conflict{}; if(quantity==0)return Conflict{}; if(quantity>1)return SoldOut{}; return Created{"res-41"}; }
int main(){TenantId identity{"tenant-a"};auto result=reserve(identity,1);if(!std::holds_alternative<Created>(result))return EXIT_FAILURE;std::cout<<"API_DOMAIN_OUTCOME_OK\\n";}` },
    { lang: "cpp", purpose: "Trabalho assíncrono possui eventId e payload próprios depois que request termina.", code: `#include <cstdlib>
#include <functional>
#include <iostream>
#include <string>

struct Work{std::string event_id;std::string tenant;};
std::function<Work()> enqueue_copy(std::string event,std::string tenant){return [work=Work{std::move(event),std::move(tenant)}]{return work;};}
int main(){auto job=enqueue_copy("evt-41","tenant-a");auto work=job();if(work.event_id!="evt-41"||work.tenant!="tenant-a")return EXIT_FAILURE;std::cout<<"API_ASYNC_OWNERSHIP_OK\\n";}` },
  ],
  "Última vaga e replay": [
    { lang: "cpp", purpose: "Modelo local do update condicional permite um vencedor e preserva capacidade zero.", code: `#include <atomic>
#include <cstdlib>
#include <iostream>
#include <thread>

int main(){std::atomic<int> capacity{1};std::atomic<int>winners{0};auto attempt=[&]{int expected=1;if(capacity.compare_exchange_strong(expected,0))++winners;};std::thread a{attempt},b{attempt};a.join();b.join();if(winners!=1||capacity!=0)return EXIT_FAILURE;std::cout<<"LAST_SEAT_LOCAL_MODEL_OK\\n";}` },
    { lang: "cpp", purpose: "Registro idempotente distingue replay igual de conflito divergente por tenant e fingerprint.", code: `#include <cstdlib>
#include <iostream>
#include <map>
#include <string>

enum class Result{created,replayed,conflict};
Result put(std::map<std::string,std::string>& rows,std::string tenant_key,std::string fingerprint){auto [it,created]=rows.emplace(std::move(tenant_key),std::move(fingerprint));if(created)return Result::created;return it->second==fingerprint?Result::replayed:Result::conflict;}
int main(){std::map<std::string,std::string>rows;if(put(rows,"a:k","q1")!=Result::created||put(rows,"a:k","q1")!=Result::replayed||put(rows,"a:k","q2")!=Result::conflict)return EXIT_FAILURE;std::cout<<"FINAL_REPLAY_CONTRACT_OK\\n";}` },
  ],
  "Segurança, fuzz e carga": [
    { lang: "cpp", purpose: "Boundary rejeita payload acima do limite antes de copiar ou alocar estrutura de domínio.", code: `#include <cstdlib>
#include <iostream>
#include <span>
#include <vector>

bool bounded_request(std::span<const unsigned char> bytes){constexpr std::size_t max=1024;return !bytes.empty()&&bytes.size()<=max;}
int main(){std::vector<unsigned char>ok(41),huge(1025);if(!bounded_request(ok)||bounded_request(huge)||bounded_request({}))return EXIT_FAILURE;std::cout<<"FUZZ_BOUNDARY_BOUNDED_OK\\n";}` },
    { lang: "cpp", purpose: "Quota por tenant impede um cliente de consumir toda a capacidade local do executor.", code: `#include <cstdlib>
#include <iostream>
#include <map>
#include <string>

class Quota{std::map<std::string,unsigned>active_;unsigned per_tenant_;public:explicit Quota(unsigned n):per_tenant_(n){}bool admit(const std::string&t){auto&n=active_[t];if(n>=per_tenant_)return false;++n;return true;}};
int main(){Quota quota{2};if(!quota.admit("a")||!quota.admit("a")||quota.admit("a")||!quota.admit("b"))return EXIT_FAILURE;std::cout<<"TENANT_FAIRNESS_QUOTA_OK\\n";}` },
  ],
  "Banca, deploy e restore": [
    { lang: "cpp", purpose: "Matriz de evidências falha enquanto qualquer gate obrigatório está Pending.", code: `#include <cstdlib>
#include <iostream>
#include <vector>

enum class Gate{passed,failed,pending};
bool publishable(const std::vector<Gate>& gates){for(auto gate:gates)if(gate!=Gate::passed)return false;return !gates.empty();}
int main(){if(publishable({Gate::passed,Gate::pending})||!publishable({Gate::passed,Gate::passed}))return EXIT_FAILURE;std::cout<<"EVIDENCE_MATRIX_CLOSED_OK\\n";}` },
    { lang: "cpp", purpose: "Restore mantém identidade e exige reconciliação antes de liberar delivery.", code: `#include <cstdlib>
#include <iostream>
#include <string>

struct RestoredEvent{std::string id;bool reconciled;bool delivery_enabled;};
void reconcile(RestoredEvent& event,bool provider_has_effect){if(provider_has_effect){event.reconciled=true;event.delivery_enabled=false;}else{event.reconciled=true;event.delivery_enabled=true;}}
int main(){RestoredEvent event{"evt-41",false,false};reconcile(event,true);if(!event.reconciled||event.delivery_enabled||event.id!="evt-41")return EXIT_FAILURE;std::cout<<"RESTORE_BEFORE_DELIVERY_OK\\n";}` },
  ],
};
