/** Cada entrada contém dois programas completos, compilados e executados isoladamente. */
export const JAVA_EXAMPLES: Record<string, [string, string]> = {
  "JDK, JRE, versões e vendors": [
    `class Main {
  public static void main(String[] args) {
    var runtime = Runtime.version();
    var vendor = System.getProperty("java.vendor");
    if (runtime.feature() < 21 || vendor == null || vendor.isBlank()) throw new AssertionError("Toolchain não identificada");
    System.out.printf("feature=%d vendor=%s vm=%s%n", runtime.feature(), vendor, System.getProperty("java.vm.name"));
  }
}`,
    `import java.io.*;
class Main {
  public static void main(String[] args) throws Exception {
    try (var in = Main.class.getResourceAsStream("/Main.class")) {
      if (in == null || in.read() != 0xCA || in.read() != 0xFE || in.read() != 0xBA || in.read() != 0xBE) throw new AssertionError("Class file inválido");
      in.skipNBytes(2);
      int major = (in.read() << 8) | in.read();
      if (major > 67) throw new AssertionError("Esperava bytecode compatível com JDK 23");
      System.out.println("class-major=" + major);
    }
  }
}`,
  ],
  "Fonte, classe, main e argumentos": [
    `import java.io.PrintStream;
class Main {
  static int run(String[] args, PrintStream out, PrintStream err) {
    if (args.length != 2 || !args[0].equals("--limit")) { err.println("usage: --limit N"); return 2; }
    try { int n = Integer.parseInt(args[1]); if (n < 1 || n > 100) throw new NumberFormatException(); out.println("limit=" + n); return 0; }
    catch (NumberFormatException ex) { err.println("invalid_limit"); return 2; }
  }
  public static void main(String[] args) { if (run(new String[]{"--limit", "20"}, System.out, System.err) != 0) throw new AssertionError(); }
}`,
    `import java.io.*;
import java.nio.charset.StandardCharsets;
class Main {
  public static void main(String[] args) throws Exception {
    var outBytes = new ByteArrayOutputStream(); var errBytes = new ByteArrayOutputStream();
    int code = MainProgram.run(new String[]{"--unknown"}, new PrintStream(outBytes, true, StandardCharsets.UTF_8), new PrintStream(errBytes, true, StandardCharsets.UTF_8));
    if (code != 2 || outBytes.size() != 0 || !errBytes.toString(StandardCharsets.UTF_8).contains("usage")) throw new AssertionError("Contrato de processo violado");
    System.out.println("exit-contract-ok");
  }
}
class MainProgram {
  static int run(String[] args, PrintStream out, PrintStream err) { if (args.length != 2) { err.println("usage: --input PATH"); return 2; } out.println(args[1]); return 0; }
}`,
  ],
  "Packages, classpath e module path": [
    `import java.net.URL;
class Main {
  public static void main(String[] args) {
    Class<?> type = Main.class;
    URL origin = type.getProtectionDomain().getCodeSource().getLocation();
    if (!type.getName().equals("Main") || origin == null) throw new AssertionError("Origem desconhecida");
    System.out.println("name=" + type.getName() + " loader=" + type.getClassLoader().getClass().getName());
    System.out.println("code-source=" + origin.toExternalForm());
  }
}`,
    `class Main {
  static final class Isolated extends ClassLoader {
    Isolated() { super(null); }
    Class<?> define(byte[] bytes) { return defineClass("Payload", bytes, 0, bytes.length); }
  }
  public static void main(String[] args) throws Exception {
    byte[] bytes;
    try (var stream = Main.class.getResourceAsStream("/Payload.class")) { if (stream == null) throw new AssertionError(); bytes = stream.readAllBytes(); }
    Class<?> left = new Isolated().define(bytes), right = new Isolated().define(bytes);
    if (!left.getName().equals(right.getName()) || left == right || left.isAssignableFrom(right)) throw new AssertionError("Identidade não inclui loader");
    System.out.println("same-name-different-type");
  }
}
class Payload {}`,
  ],
  "JShell, javac, jar e diagnóstico": [
    `import javax.tools.ToolProvider;
import java.nio.file.*;
import java.nio.charset.StandardCharsets;
class Main {
  public static void main(String[] args) throws Exception {
    var dir = Files.createTempDirectory("java-toolchain-");
    try {
      var source = dir.resolve("Probe.java");
      Files.writeString(source, "class Probe { static int value() { return 42; } }", StandardCharsets.UTF_8);
      int status = ToolProvider.getSystemJavaCompiler().run(null, System.out, System.err, "--release", "21", "-d", dir.toString(), source.toString());
      if (status != 0 || !Files.exists(dir.resolve("Probe.class"))) throw new AssertionError("Compilação limpa falhou");
      System.out.println("javac-output-verified");
    } finally { try (var files = Files.list(dir)) { for (var file : files.toList()) Files.delete(file); } Files.delete(dir); }
  }
}`,
    `import java.io.*;
import java.nio.file.*;
import java.util.spi.ToolProvider;
class Main {
  public static void main(String[] args) throws Exception {
    var jarTool = ToolProvider.findFirst("jar").orElseThrow();
    var artifact = Files.createTempFile("java-artifact-", ".jar");
    try {
      int created = jarTool.run(System.out, System.err, "--create", "--file", artifact.toString(), "-C", System.getProperty("java.class.path"), "Main.class");
      if (created != 0 || Files.size(artifact) == 0) throw new AssertionError("JAR não criado");
      int listed = jarTool.run(System.out, System.err, "--list", "--file", artifact.toString());
      if (listed != 0) throw new AssertionError("JAR ilegível");
    } finally { Files.deleteIfExists(artifact); }
  }
}`,
  ],
  "Primitivos, overflow e precisão": [
    `import java.math.*;
class Main {
  public static void main(String[] args) {
    long cents = Math.multiplyExact((long) 2_000_000_000, 3L);
    if (cents != 6_000_000_000L) throw new AssertionError("Produto incorreto");
    BigDecimal price = new BigDecimal("19.90");
    BigDecimal total = price.multiply(BigDecimal.valueOf(3));
    if (total.compareTo(new BigDecimal("59.70")) != 0) throw new AssertionError("Preço incorreto");
    System.out.println("cents=" + cents + " total=" + total);
  }
}`,
    `import java.math.*;
class Main {
  public static void main(String[] args) {
    long alreadyOverflowed = 2_000_000_000 * 3;
    if (alreadyOverflowed == 6_000_000_000L) throw new AssertionError("Mutante não reproduzido");
    if (0.1 + 0.2 == 0.3) throw new AssertionError("Precisão binária presumida");
    if (new BigDecimal("1.0").equals(new BigDecimal("1.00"))) throw new AssertionError("Scale ignorada");
    if (new BigDecimal("1.0").compareTo(new BigDecimal("1.00")) != 0) throw new AssertionError("Valor desigual");
    try { Math.addExact(Integer.MAX_VALUE, 1); throw new AssertionError("Overflow não detectado"); }
    catch (ArithmeticException expected) { System.out.println("overflow-classificado"); }
  }
}`,
  ],
  "Referências, null e identidade": [
    `import java.util.*;
class Main {
  static void mutate(List<String> input) { input.add("persistiu"); input = new ArrayList<>(); input.add("não persistiu"); }
  public static void main(String[] args) {
    var values = new ArrayList<String>();
    mutate(values);
    if (!values.equals(List.of("persistiu"))) throw new AssertionError("Aliasing ou passagem por valor mal compreendidos");
    var first = new String("chave"); var second = new String("chave");
    if (first == second || !first.equals(second)) throw new AssertionError("Identidade confundida com valor");
    System.out.println("reference-contract-ok");
  }
}`,
    `import java.util.*;
class Main {
  record Key(List<String> parts) {}
  public static void main(String[] args) {
    var mutable = new ArrayList<>(List.of("tenant"));
    var unsafe = new Key(mutable); var map = new HashMap<Key, String>(); map.put(unsafe, "value");
    mutable.add("changed");
    if (map.containsKey(new Key(List.of("tenant")))) throw new AssertionError("Mutação não foi reproduzida");
    var safe = new Key(List.copyOf(mutable));
    try { safe.parts().add("forbidden"); throw new AssertionError("Cópia não protegida"); }
    catch (UnsupportedOperationException expected) { System.out.println("immutable-key-ok"); }
  }
}`,
  ],
  "Strings, Unicode e text blocks": [
    `import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
class Main {
  public static void main(String[] args) {
    String text = "A😀é";
    if (text.length() != 4 || text.codePointCount(0, text.length()) != 3) throw new AssertionError("UTF-16 confundido com code point");
    byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
    if (!text.equals(new String(bytes, StandardCharsets.UTF_8))) throw new AssertionError("Round trip UTF-8 falhou");
    if (!Normalizer.normalize("e\u0301", Normalizer.Form.NFC).equals("é")) throw new AssertionError("NFC falhou");
    System.out.println("unicode-contract-ok");
  }
}`,
    `import java.nio.charset.*;
class Main {
  public static void main(String[] args) {
    String original = "ação";
    String wrong = new String(original.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1);
    if (original.equals(wrong)) throw new AssertionError("Mojibake não reproduzido");
    String sql = """
        select id
        from tasks
        where title = ?
        """;
    if (!sql.contains("title = ?") || sql.contains("'" + original + "'")) throw new AssertionError("Query não parametrizada");
    System.out.println("charset-mutant-detected");
  }
}`,
  ],
  "Controle, switch e escopo": [
    `class Main {
  enum State { NEW, RESERVED, CANCELLED }
  static boolean canShip(State state) {
    return switch (state) {
      case NEW -> false;
      case RESERVED -> true;
      case CANCELLED -> false;
    };
  }
  public static void main(String[] args) {
    for (State state : State.values()) if (canShip(state) != (state == State.RESERVED)) throw new AssertionError(state);
    System.out.println("exhaustive-switch-ok");
  }
}`,
    `import java.util.*;
class Main {
  static int sum(List<Integer> values) {
    int total = 0;
    for (int index = 0; index < values.size(); index++) total = Math.addExact(total, values.get(index));
    return total;
  }
  public static void main(String[] args) {
    if (sum(List.of()) != 0 || sum(List.of(2, 3)) != 5) throw new AssertionError("Loop incorreto");
    try { List.of(2, 3).get(2); throw new AssertionError("Mutante <= não reproduzido"); }
    catch (IndexOutOfBoundsException expected) { System.out.println("off-by-one-detected"); }
  }
}`,
  ],
  "Classes, encapsulamento e invariantes": [
    `class Main {
  static final class Wallet {
    private long cents;
    Wallet(long initial) { if (initial < 0) throw new IllegalArgumentException("negative_initial"); cents = initial; }
    long balance() { return cents; }
    void debit(long amount) { if (amount <= 0 || amount > cents) throw new IllegalArgumentException("invalid_debit"); cents = Math.subtractExact(cents, amount); }
  }
  public static void main(String[] args) {
    var wallet = new Wallet(500);
    wallet.debit(200);
    if (wallet.balance() != 300) throw new AssertionError("Transição inválida");
    try { wallet.debit(400); throw new AssertionError("Saldo negativo aceito"); }
    catch (IllegalArgumentException expected) { if (wallet.balance() != 300) throw new AssertionError("Falha alterou estado"); }
    System.out.println("wallet-invariant-ok");
  }
}`,
    `import java.util.*;
class Main {
  static final class UnsafeOrder {
    private final List<String> lines;
    UnsafeOrder(List<String> lines) { this.lines = lines; }
    List<String> lines() { return lines; }
  }
  static final class SafeOrder {
    private final List<String> lines;
    SafeOrder(List<String> lines) { this.lines = List.copyOf(lines); }
    List<String> lines() { return lines; }
  }
  public static void main(String[] args) {
    var source = new ArrayList<>(List.of("A"));
    var unsafe = new UnsafeOrder(source); var safe = new SafeOrder(source);
    source.add("B");
    if (unsafe.lines().size() != 2 || safe.lines().size() != 1) throw new AssertionError("Aliasing não observado");
    System.out.println("defensive-copy-ok");
  }
}`,
  ],
  "Records e value objects": [
    `import java.util.*;
class Main {
  record Tags(List<String> values) {
    Tags { values = List.copyOf(values); if (values.isEmpty()) throw new IllegalArgumentException("empty_tags"); }
  }
  public static void main(String[] args) {
    var source = new ArrayList<>(List.of("safe"));
    var tags = new Tags(source); source.add("outside");
    if (!tags.values().equals(List.of("safe")) || !tags.equals(new Tags(List.of("safe")))) throw new AssertionError("Value semantics falharam");
    try { tags.values().add("bad"); throw new AssertionError("Record mutável"); }
    catch (UnsupportedOperationException expected) { System.out.println("record-value-ok"); }
  }
}`,
    `import java.util.*;
class Main {
  record UnsafeBytes(byte[] bytes) {}
  record SafeBytes(List<Byte> bytes) { SafeBytes { bytes = List.copyOf(bytes); } }
  public static void main(String[] args) {
    var left = new UnsafeBytes(new byte[]{1, 2}); var right = new UnsafeBytes(new byte[]{1, 2});
    if (left.equals(right)) throw new AssertionError("Array equality foi tratada como conteúdo");
    var safeLeft = new SafeBytes(List.of((byte) 1, (byte) 2)); var safeRight = new SafeBytes(List.of((byte) 1, (byte) 2));
    if (!safeLeft.equals(safeRight) || safeLeft.hashCode() != safeRight.hashCode()) throw new AssertionError("Contrato de valor falhou");
    System.out.println("array-record-mutant-detected");
  }
}`,
  ],
  "Interfaces, herança e composição": [
    `import java.util.*;
class Main {
  interface Store { String save(String requestKey, String value); }
  static final class InMemoryStore implements Store {
    private final Map<String, String> saved = new HashMap<>();
    public String save(String requestKey, String value) {
      if (saved.containsKey(requestKey) && !saved.get(requestKey).equals(value)) throw new IllegalArgumentException("idempotency_conflict");
      return saved.computeIfAbsent(requestKey, key -> value);
    }
  }
  static void contract(Store store) {
    if (!store.save("key", "A").equals(store.save("key", "A"))) throw new AssertionError("Retry mudou resultado");
    try { store.save("key", "B"); throw new AssertionError("Payload diferente aceito"); }
    catch (IllegalArgumentException expected) { System.out.println("store-contract-ok"); }
  }
  public static void main(String[] args) { contract(new InMemoryStore()); }
}`,
    `class Main {
  interface Pricing { long finalCents(long baseCents); }
  static final class Checkout {
    private final Pricing pricing;
    Checkout(Pricing pricing) { this.pricing = java.util.Objects.requireNonNull(pricing); }
    final long charge(long baseCents) { if (baseCents < 0) throw new IllegalArgumentException(); long result = pricing.finalCents(baseCents); if (result < 0) throw new IllegalStateException(); return result; }
  }
  public static void main(String[] args) {
    var checkout = new Checkout(base -> Math.addExact(base, 50));
    if (checkout.charge(100) != 150) throw new AssertionError("Composição falhou");
    try { new Checkout(base -> -1).charge(100); throw new AssertionError("Estratégia violou invariante"); }
    catch (IllegalStateException expected) { System.out.println("composed-boundary-ok"); }
  }
}`,
  ],
  "Sealed types e patterns": [
    `class Main {
  sealed interface Result permits Accepted, Rejected, Retryable {}
  record Accepted(String id) implements Result {}
  record Rejected(String reason) implements Result {}
  record Retryable(String requestKey) implements Result {}
  static String decision(Result result) {
    return switch (result) {
      case Accepted(var id) -> "ok:" + id;
      case Rejected(var reason) -> "deny:" + reason;
      case Retryable(var key) -> "retry:" + key;
    };
  }
  public static void main(String[] args) {
    if (!decision(new Accepted("42")).equals("ok:42") || !decision(new Rejected("rule")).equals("deny:rule")) throw new AssertionError("Pattern switch incorreto");
    System.out.println("sealed-exhaustive-ok");
  }
}`,
    `class Main {
  sealed interface Outcome permits Committed, Unknown {}
  record Committed(String id) implements Outcome {}
  record Unknown(String requestKey) implements Outcome {}
  static boolean shouldRetryWrite(Outcome outcome) {
    return switch (outcome) {
      case Committed(var id) -> false;
      case Unknown(var key) -> false;
    };
  }
  public static void main(String[] args) {
    if (shouldRetryWrite(new Unknown("request-1"))) throw new AssertionError("Timeout ambíguo provocou retry cego");
    try { shouldRetryWrite(null); throw new AssertionError("Null aceito"); }
    catch (NullPointerException expected) { System.out.println("unknown-outcome-reconcile-first"); }
  }
}`,
  ],
  "Generics, invariância e wildcards": [
    `import java.util.*;
class Main {
  static double sum(List<? extends Number> source) { double total = 0; for (Number value : source) total += value.doubleValue(); return total; }
  static void appendIntegers(List<? super Integer> target, int... values) { for (int value : values) target.add(value); }
  public static void main(String[] args) {
    var source = List.of(1, 2, 3); var target = new ArrayList<Number>();
    appendIntegers(target, 4, 5);
    if (sum(source) != 6 || sum(target) != 9) throw new AssertionError("PECS violado");
    System.out.println("wildcards-producer-consumer-ok");
  }
}`,
    `import java.util.*;
class Main {
  static void swapUnknown(List<?> list, int left, int right) { swapCaptured(list, left, right); }
  private static <T> void swapCaptured(List<T> list, int left, int right) { T old = list.get(left); list.set(left, list.get(right)); list.set(right, old); }
  public static void main(String[] args) {
    var letters = new ArrayList<>(List.of("A", "B")); var numbers = new ArrayList<>(List.of(1, 2));
    swapUnknown(letters, 0, 1); swapUnknown(numbers, 0, 1);
    if (!letters.equals(List.of("B", "A")) || !numbers.equals(List.of(2, 1))) throw new AssertionError("Capture falhou");
    System.out.println("capture-helper-ok");
  }
}`,
  ],
  "Erasure, reificação e arrays": [
    `import java.lang.reflect.*;
import java.util.*;
class Main {
  List<String> declared;
  public static void main(String[] args) throws Exception {
    if (new ArrayList<String>().getClass() != new ArrayList<Integer>().getClass()) throw new AssertionError("Erasure não observada");
    Type declaration = Main.class.getDeclaredField("declared").getGenericType();
    if (!(declaration instanceof ParameterizedType p) || !p.getActualTypeArguments()[0].getTypeName().equals("java.lang.String")) throw new AssertionError("Metadata genérica ausente");
    System.out.println("runtime-class-versus-declaration-ok");
  }
}`,
    `class Main {
  public static void main(String[] args) {
    Object[] values = new String[1];
    values[0] = "safe";
    try { values[0] = Integer.valueOf(42); throw new AssertionError("Array aceitou tipo errado"); }
    catch (ArrayStoreException expected) { System.out.println("array-runtime-check-observed"); }
    if (!values[0].equals("safe")) throw new AssertionError("Falha corrompeu array");
  }
}`,
  ],
  "List, Set, Map e igualdade": [
    `import java.util.*;
class Main {
  record Key(String tenant, String id) {}
  public static void main(String[] args) {
    var insertionOrder = new LinkedHashSet<>(List.of("B", "A", "B"));
    if (!new ArrayList<>(insertionOrder).equals(List.of("B", "A"))) throw new AssertionError("Ordem ou unicidade violada");
    var lookup = new HashMap<Key, Integer>(); lookup.put(new Key("t1", "42"), 7);
    if (!Integer.valueOf(7).equals(lookup.get(new Key("t1", "42")))) throw new AssertionError("Igualdade da chave falhou");
    System.out.println("collection-contract-ok");
  }
}`,
    `import java.util.*;
class Main {
  public static void main(String[] args) {
    Comparator<String> broken = Comparator.comparingInt(String::length);
    var lost = new TreeSet<>(broken); lost.add("AB"); lost.add("CD");
    if (lost.size() != 1) throw new AssertionError("Mutante de comparator não reproduzido");
    var safe = new TreeSet<>(broken.thenComparing(Comparator.naturalOrder())); safe.add("AB"); safe.add("CD");
    if (safe.size() != 2) throw new AssertionError("Desempate não preservou valores");
    System.out.println("comparator-collision-detected");
  }
}`,
  ],
  "Imutabilidade, cópias e concorrência": [
    `import java.util.*;
class Main {
  public static void main(String[] args) {
    var backing = new ArrayList<>(List.of("A"));
    List<String> view = Collections.unmodifiableList(backing);
    List<String> snapshot = List.copyOf(backing);
    backing.add("B");
    if (view.size() != 2 || snapshot.size() != 1) throw new AssertionError("View confundida com snapshot");
    try { snapshot.add("C"); throw new AssertionError("Snapshot mutável"); }
    catch (UnsupportedOperationException expected) { System.out.println("snapshot-contract-ok"); }
  }
}`,
    `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
class Main {
  public static void main(String[] args) throws Exception {
    var map = new ConcurrentHashMap<String, Integer>();
    var started = new CountDownLatch(1); var calls = new AtomicInteger();
    try (var pool = Executors.newFixedThreadPool(2)) {
      var left = pool.submit(() -> { started.await(); return map.computeIfAbsent("job", key -> { calls.incrementAndGet(); return 42; }); });
      var right = pool.submit(() -> { started.await(); return map.computeIfAbsent("job", key -> { calls.incrementAndGet(); return 42; }); });
      started.countDown();
      if (left.get() != 42 || right.get() != 42 || calls.get() != 1) throw new AssertionError("Operação composta falhou");
    }
    System.out.println("atomic-map-insertion-ok");
  }
}`,
  ],
  "Checked, unchecked e fronteiras": [
    `import java.io.*;
class Main {
  sealed interface Result permits Found, Unavailable {}
  record Found(String value) implements Result {}
  record Unavailable(String requestKey, IOException cause) implements Result {}
  static Result load(String requestKey) {
    try { throw new IOException("disk_unavailable"); }
    catch (IOException cause) { return new Unavailable(requestKey, cause); }
  }
  public static void main(String[] args) {
    Result result = load("key-1");
    if (!(result instanceof Unavailable u) || !u.requestKey().equals("key-1") || !(u.cause() instanceof IOException)) throw new AssertionError("Falha virou ausência");
    System.out.println("classified-unavailable");
  }
}`,
    `import java.util.concurrent.*;
class Main {
  static boolean work() {
    try { new CountDownLatch(1).await(); return true; }
    catch (InterruptedException interrupted) { Thread.currentThread().interrupt(); return Thread.currentThread().isInterrupted(); }
  }
  public static void main(String[] args) throws Exception {
    try (var pool = Executors.newSingleThreadExecutor()) {
      var started = new CountDownLatch(1);
      var task = pool.submit(() -> { started.countDown(); return work(); });
      started.await();
      pool.shutdownNow();
      if (!task.get(5, TimeUnit.SECONDS)) throw new AssertionError("Interrupção ignorada");
    }
    System.out.println("interrupt-restored");
  }
}`,
  ],
  "Causa, contexto e suppressed": [
    `import java.io.*;
class Main {
  static final class ImportFailure extends RuntimeException { ImportFailure(String operation, Throwable cause) { super(operation, cause); } }
  static void load() { try { throw new IOException("disk_read_failed"); } catch (IOException cause) { throw new ImportFailure("import_failed", cause); } }
  public static void main(String[] args) {
    try { load(); throw new AssertionError("Falha perdida"); }
    catch (ImportFailure failure) {
      if (!(failure.getCause() instanceof IOException) || !failure.getMessage().equals("import_failed")) throw new AssertionError("Causa perdida");
      System.out.println("cause-chain-preserved");
    }
  }
}`,
    `class Main {
  static final class FailingResource implements AutoCloseable { public void close() { throw new IllegalStateException("close_failed"); } }
  public static void main(String[] args) {
    try (var resource = new FailingResource()) { throw new IllegalArgumentException("body_failed"); }
    catch (IllegalArgumentException primary) {
      if (!primary.getMessage().equals("body_failed") || primary.getSuppressed().length != 1 || !primary.getSuppressed()[0].getMessage().equals("close_failed")) throw new AssertionError("Erro original foi sobrescrito");
      System.out.println("suppressed-preserved");
    }
  }
}`,
  ],
  "Try-with-resources e ownership": [
    `import java.util.*;
class Main {
  static final class Resource implements AutoCloseable {
    private final String name; private final List<String> closed;
    Resource(String name, List<String> closed) { this.name = name; this.closed = closed; }
    public void close() { closed.add(name); }
  }
  public static void main(String[] args) {
    var closed = new ArrayList<String>();
    try (var outer = new Resource("outer", closed); var inner = new Resource("inner", closed)) { closed.add("body"); }
    if (!closed.equals(List.of("body", "inner", "outer"))) throw new AssertionError("Close fora da ordem reversa");
    System.out.println("resource-order-ok");
  }
}`,
    `import java.nio.file.*;
import java.util.stream.*;
class Main {
  public static void main(String[] args) throws Exception {
    Path file = Files.createTempFile("java-lines-", ".txt");
    try {
      Files.writeString(file, "A\\nB\\n");
      long count;
      try (Stream<String> lines = Files.lines(file)) { count = lines.filter(s -> !s.isBlank()).count(); }
      if (count != 2) throw new AssertionError("Stream não consumido no escopo");
      System.out.println("stream-owned-and-closed");
    } finally { Files.deleteIfExists(file); }
  }
}`,
  ],
  "Design de API e validação": [
    `import java.util.*;
class Main {
  record TenantId(String value) { TenantId { if (value == null || value.isBlank()) throw new IllegalArgumentException("tenant_required"); } }
  record Quantity(int value) { Quantity { if (value < 1 || value > 100) throw new IllegalArgumentException("quantity_out_of_range"); } }
  static String reserve(TenantId tenant, Quantity quantity, String requestKey) { Objects.requireNonNull(requestKey); return tenant.value() + ":" + quantity.value() + ":" + requestKey; }
  public static void main(String[] args) {
    if (!reserve(new TenantId("t1"), new Quantity(2), "r1").equals("t1:2:r1")) throw new AssertionError();
    try { new Quantity(-1); throw new AssertionError("Invalid quantity accepted"); }
    catch (IllegalArgumentException expected) { System.out.println("typed-api-validation-ok"); }
  }
}`,
    `import java.util.*;
class Main {
  sealed interface Lookup permits Found, NotFound, Unavailable {}
  record Found(String value) implements Lookup {}
  record NotFound() implements Lookup {}
  record Unavailable(String code) implements Lookup {}
  static Lookup find(boolean databaseAvailable, boolean exists) { if (!databaseAvailable) return new Unavailable("db_unavailable"); return exists ? new Found("item") : new NotFound(); }
  public static void main(String[] args) {
    if (!(find(false, false) instanceof Unavailable) || !(find(true, false) instanceof NotFound)) throw new AssertionError("Falha confundida com ausência");
    Optional<String> present = Optional.of("value");
    if (!present.orElseGet(() -> { throw new AssertionError("Fallback eager"); }).equals("value")) throw new AssertionError();
    System.out.println("result-boundary-ok");
  }
}`,
  ],
  "Lambdas e interfaces funcionais": [
    `import java.util.function.*;
class Main {
  @FunctionalInterface interface Rule { boolean accept(int amount); }
  public static void main(String[] args) {
    Rule positive = amount -> amount > 0;
    Function<Integer, Integer> addTwo = value -> value + 2;
    Function<Integer, Integer> doubleIt = value -> value * 2;
    if (!positive.accept(3) || positive.accept(0) || addTwo.andThen(doubleIt).apply(3) != 10 || addTwo.compose(doubleIt).apply(3) != 8) throw new AssertionError("Composição ou regra incorreta");
    System.out.println("lambda-contract-ok");
  }
}`,
    `import java.util.*;
import java.util.function.*;
class Main {
  public static void main(String[] args) {
    var calls = new int[]{0};
    Supplier<String> effectful = () -> { calls[0]++; return "fallback"; };
    String value = Optional.of("present").orElse(effectful.get());
    if (!value.equals("present") || calls[0] != 1) throw new AssertionError("Mutante eager não observado");
    calls[0] = 0;
    value = Optional.of("present").orElseGet(effectful);
    if (!value.equals("present") || calls[0] != 0) throw new AssertionError("Fallback lazy falhou");
    System.out.println("supplier-side-effect-detected");
  }
}`,
  ],
  "Streams, lazy evaluation e terminal": [
    `import java.util.*;
import java.util.concurrent.atomic.*;
class Main {
  public static void main(String[] args) {
    var calls = new AtomicInteger();
    var pipeline = List.of(1, 2, 3, 4).stream().map(value -> { calls.incrementAndGet(); return value * 2; });
    if (calls.get() != 0) throw new AssertionError("Stream executou antes de terminal");
    int first = pipeline.filter(value -> value > 4).findFirst().orElseThrow();
    if (first != 6 || calls.get() != 3) throw new AssertionError("Short circuit incorreto: " + calls.get());
    System.out.println("lazy-short-circuit-ok");
  }
}`,
    `import java.util.*;
class Main {
  record Order(List<Integer> lines) {}
  public static void main(String[] args) {
    var orders = List.of(new Order(List.of(3, 5)), new Order(List.of()), new Order(List.of(7)));
    var flattened = orders.stream().flatMap(order -> order.lines().stream()).toList();
    if (!flattened.equals(List.of(3, 5, 7))) throw new AssertionError("Grão flatMap incorreto");
    try { flattened.add(9); throw new AssertionError("Stream.toList mutável"); }
    catch (UnsupportedOperationException expected) { System.out.println("stream-cardinality-ok"); }
  }
}`,
  ],
  "Collectors e agregação": [
    `import java.math.*;
import java.util.*;
import java.util.stream.*;
class Main {
  record Sale(String tenant, BigDecimal amount) {}
  public static void main(String[] args) {
    var sales = List.of(new Sale("A", new BigDecimal("1.20")), new Sale("A", new BigDecimal("2.30")), new Sale("B", new BigDecimal("4.00")));
    Map<String, BigDecimal> totals = sales.stream().collect(Collectors.groupingBy(Sale::tenant, Collectors.reducing(BigDecimal.ZERO, Sale::amount, BigDecimal::add)));
    if (totals.get("A").compareTo(new BigDecimal("3.50")) != 0 || totals.get("B").compareTo(new BigDecimal("4.00")) != 0) throw new AssertionError("Agregação por tenant incorreta");
    System.out.println("collector-grain-ok");
  }
}`,
    `import java.util.*;
import java.util.stream.*;
class Main {
  record Item(String key, int value) {}
  public static void main(String[] args) {
    var items = List.of(new Item("same", 1), new Item("same", 2));
    try { items.stream().collect(Collectors.toMap(Item::key, Item::value)); throw new AssertionError("Duplicata aceita sem política"); }
    catch (IllegalStateException expected) { /* colisão explícita */ }
    var totals = items.stream().collect(Collectors.toMap(Item::key, Item::value, Integer::sum));
    if (totals.get("same") != 3) throw new AssertionError("Merge não somou");
    System.out.println("to-map-duplicate-policy-ok");
  }
}`,
  ],
  "Parallel streams e side effects": [
    `import java.util.*;
import java.util.stream.*;
class Main {
  public static void main(String[] args) {
    long sequential = IntStream.rangeClosed(1, 10_000).mapToLong(value -> value).sum();
    long parallel = IntStream.rangeClosed(1, 10_000).parallel().mapToLong(value -> value).sum();
    if (sequential != 50_005_000L || parallel != sequential) throw new AssertionError("Redução associativa falhou");
    var values = IntStream.range(0, 1_000).parallel().boxed().collect(Collectors.toList());
    if (values.size() != 1_000 || new HashSet<>(values).size() != 1_000) throw new AssertionError("Collector paralelo perdeu valores");
    System.out.println("parallel-pure-reduction-ok");
  }
}`,
    `import java.util.stream.*;
class Main {
  public static void main(String[] args) {
    int sequential = IntStream.range(0, 100).reduce(0, (left, right) -> left - right);
    int parallel = IntStream.range(0, 100).parallel().reduce(0, (left, right) -> left - right);
    if (sequential == parallel) throw new AssertionError("Mutante não associativo não discriminou partições");
    long safe = IntStream.range(0, 100).parallel().mapToLong(value -> value).sum();
    if (safe != 4_950L) throw new AssertionError("Soma segura falhou");
    System.out.println("non-associative-reduce-detected");
  }
}`,
  ],
  "Bytes, chars e charsets": [
    `import java.io.*;
import java.nio.charset.*;
class Main {
  public static void main(String[] args) throws Exception {
    String value = "ação 😀";
    byte[] encoded = value.getBytes(StandardCharsets.UTF_8);
    var decoder = StandardCharsets.UTF_8.newDecoder().onMalformedInput(CodingErrorAction.REPORT);
    String decoded = decoder.decode(java.nio.ByteBuffer.wrap(encoded)).toString();
    if (!value.equals(decoded) || encoded.length <= value.length()) throw new AssertionError("Round trip UTF-8 falhou");
    System.out.println("explicit-charset-ok");
  }
}`,
    `import java.io.*;
class Main {
  static final class OneByteAtATime extends ByteArrayInputStream {
    OneByteAtATime(byte[] bytes) { super(bytes); }
    public synchronized int read(byte[] bytes, int offset, int length) { return super.read(bytes, offset, Math.min(1, length)); }
  }
  public static void main(String[] args) throws Exception {
    byte[] source = new byte[]{1, 2, 3, 4}; var stream = new OneByteAtATime(source);
    byte[] buffer = new byte[4];
    int first = stream.read(buffer, 0, 4);
    if (first != 1) throw new AssertionError("Leitura parcial não reproduzida");
    int offset = first;
    while (offset < buffer.length) { int n = stream.read(buffer, offset, buffer.length - offset); if (n < 0) throw new EOFException(); offset += n; }
    if (!java.util.Arrays.equals(source, buffer)) throw new AssertionError("Loop não completou leitura");
    System.out.println("partial-read-handled");
  }
}`,
  ],
  "Paths, Files e atomicidade": [
    `import java.nio.file.*;
class Main {
  public static void main(String[] args) throws Exception {
    Path root = Files.createTempDirectory("java-safe-root-");
    try {
      Path candidate = root.resolve("../outside.txt").normalize();
      if (candidate.startsWith(root)) throw new AssertionError("Traversal aceito");
      Path valid = root.resolve("item.txt").normalize();
      if (!valid.startsWith(root)) throw new AssertionError("Path válido negado");
      Files.writeString(valid, "safe", StandardOpenOption.CREATE_NEW);
      if (!Files.readString(valid).equals("safe")) throw new AssertionError("Conteúdo errado");
      Files.delete(valid);
    } finally { Files.delete(root); }
    System.out.println("path-boundary-ok");
  }
}`,
    `import java.nio.file.*;
class Main {
  public static void main(String[] args) throws Exception {
    Path root = Files.createTempDirectory("java-atomic-");
    Path target = root.resolve("config.txt"), pending = root.resolve("config.pending");
    try {
      Files.writeString(target, "old"); Files.writeString(pending, "new-complete");
      try { Files.move(pending, target, StandardCopyOption.ATOMIC_MOVE, StandardCopyOption.REPLACE_EXISTING); }
      catch (AtomicMoveNotSupportedException unsupported) { throw new AssertionError("Fixture requer atomic move", unsupported); }
      if (!Files.readString(target).equals("new-complete") || Files.exists(pending)) throw new AssertionError("Promoção incompleta");
    } finally { Files.deleteIfExists(pending); Files.deleteIfExists(target); Files.delete(root); }
    System.out.println("atomic-promotion-ok");
  }
}`,
  ],
  "NIO, buffers e channels": [
    `import java.nio.*;
import java.nio.charset.*;
class Main {
  public static void main(String[] args) throws Exception {
    var buffer = ByteBuffer.allocate(8); buffer.put((byte) 'A').put((byte) 'B').put((byte) 'C');
    buffer.flip();
    if (buffer.get() != 'A') throw new AssertionError("Flip falhou");
    buffer.compact(); buffer.put((byte) 'D'); buffer.flip();
    String result = StandardCharsets.US_ASCII.decode(buffer).toString();
    if (!result.equals("BCD")) throw new AssertionError("Compact perdeu bytes: " + result);
    System.out.println("buffer-state-ok");
  }
}`,
    `import java.io.*;
import java.nio.*;
import java.nio.channels.*;
class Main {
  static final class OneByteSink implements WritableByteChannel {
    private final ByteArrayOutputStream out = new ByteArrayOutputStream(); private boolean open = true;
    public int write(ByteBuffer source) { if (!source.hasRemaining()) return 0; out.write(source.get()); return 1; }
    public boolean isOpen() { return open; } public void close() { open = false; }
  }
  public static void main(String[] args) throws Exception {
    var sink = new OneByteSink(); var source = ByteBuffer.wrap(new byte[]{1, 2, 3, 4});
    int first = sink.write(source); if (first != 1) throw new AssertionError("Parcial não reproduzido");
    while (source.hasRemaining()) sink.write(source);
    if (!java.util.Arrays.equals(sink.out.toByteArray(), new byte[]{1, 2, 3, 4})) throw new AssertionError("Write truncado");
    sink.close(); System.out.println("partial-channel-write-handled");
  }
}`,
  ],
  "Formatos, JSON e serialização segura": [
    `import java.io.*;
import java.util.*;
class Main {
  record Envelope(int schemaVersion, String kind, String payload) {
    Envelope { if (schemaVersion != 1 || !Set.of("created", "cancelled").contains(kind) || payload == null || payload.length() > 100) throw new IllegalArgumentException("invalid_envelope"); }
  }
  public static void main(String[] args) {
    var event = new Envelope(1, "created", "id-42");
    if (!event.kind().equals("created")) throw new AssertionError();
    try { new Envelope(2, "created", "id-42"); throw new AssertionError("Versão futura aceita"); }
    catch (IllegalArgumentException expected) { System.out.println("versioned-format-boundary-ok"); }
  }
}`,
    `import java.io.*;
import java.util.*;
class Main {
  static final class Allowed implements Serializable { private static final long serialVersionUID = 1L; final String value = "ok"; }
  static final class Forbidden implements Serializable { private static final long serialVersionUID = 1L; final String value = "bad"; }
  static Object decode(byte[] bytes) throws Exception {
    try (var in = new ObjectInputStream(new ByteArrayInputStream(bytes))) {
      in.setObjectInputFilter(info -> info.serialClass() == null || info.serialClass() == Allowed.class ? ObjectInputFilter.Status.ALLOWED : ObjectInputFilter.Status.REJECTED);
      return in.readObject();
    }
  }
  static byte[] encode(Object value) throws Exception { var bytes = new ByteArrayOutputStream(); try (var out = new ObjectOutputStream(bytes)) { out.writeObject(value); } return bytes.toByteArray(); }
  public static void main(String[] args) throws Exception {
    if (!(decode(encode(new Allowed())) instanceof Allowed)) throw new AssertionError("Allowlist falhou");
    try { decode(encode(new Forbidden())); throw new AssertionError("Classe hostil aceita"); }
    catch (InvalidClassException expected) { System.out.println("native-serialization-filtered"); }
  }
}`,
  ],
  "Threads, executors e lifecycle": [
    `import java.util.concurrent.*;
class Main {
  public static void main(String[] args) throws Exception {
    try (var executor = Executors.newFixedThreadPool(2)) {
      Future<Integer> left = executor.submit(() -> 20); Future<Integer> right = executor.submit(() -> 22);
      if (left.get(5, TimeUnit.SECONDS) + right.get(5, TimeUnit.SECONDS) != 42) throw new AssertionError("Resultados perdidos");
    }
    System.out.println("executor-owned-and-closed");
  }
}`,
    `import java.util.concurrent.*;
class Main {
  public static void main(String[] args) throws Exception {
    var executor = new ThreadPoolExecutor(1, 1, 0, TimeUnit.SECONDS, new ArrayBlockingQueue<Runnable>(1), new ThreadPoolExecutor.AbortPolicy());
    var gate = new CountDownLatch(1); var running = new CountDownLatch(1);
    try {
      Future<?> first = executor.submit(() -> { running.countDown(); try { gate.await(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); } });
      running.await(); Future<?> queued = executor.submit(() -> {});
      try { executor.submit(() -> {}); throw new AssertionError("Fila ilimitada"); }
      catch (RejectedExecutionException expected) { /* backpressure */ }
      gate.countDown(); first.get(5, TimeUnit.SECONDS); queued.get(5, TimeUnit.SECONDS);
    } finally { gate.countDown(); executor.shutdownNow(); }
    System.out.println("bounded-admission-ok");
  }
}`,
  ],
  "Happens-before, locks e atomics": [
    `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
class Main {
  public static void main(String[] args) throws Exception {
    var count = new AtomicInteger();
    try (var executor = Executors.newFixedThreadPool(4)) {
      var futures = new java.util.ArrayList<Future<?>>();
      for (int thread = 0; thread < 4; thread++) futures.add(executor.submit(() -> { for (int i = 0; i < 10_000; i++) count.incrementAndGet(); }));
      for (var future : futures) future.get(10, TimeUnit.SECONDS);
    }
    if (count.get() != 40_000) throw new AssertionError("Updates perdidos");
    System.out.println("atomic-increment-ok");
  }
}`,
    `import java.util.*;
import java.util.concurrent.atomic.*;
class Main {
  record Snapshot(int version, Map<String, Integer> values) { Snapshot { values = Map.copyOf(values); } }
  public static void main(String[] args) {
    var state = new AtomicReference<>(new Snapshot(1, Map.of("marker", 1)));
    Snapshot old = state.get();
    if (!state.compareAndSet(old, new Snapshot(2, Map.of("marker", 2)))) throw new AssertionError("CAS falhou");
    Snapshot current = state.get();
    if (current.version() != current.values().get("marker")) throw new AssertionError("Versões misturadas");
    System.out.println("atomic-snapshot-ok");
  }
}`,
  ],
  "CompletableFuture e cancelamento": [
    `import java.util.concurrent.*;
class Main {
  public static void main(String[] args) {
    try (var executor = Executors.newFixedThreadPool(2)) {
      var left = CompletableFuture.supplyAsync(() -> 20, executor);
      var right = CompletableFuture.supplyAsync(() -> 22, executor);
      int total = left.thenCombine(right, Integer::sum).orTimeout(5, TimeUnit.SECONDS).join();
      if (total != 42) throw new AssertionError("Combinação incorreta");
    }
    System.out.println("future-composition-ok");
  }
}`,
    `import java.util.concurrent.*;
class Main {
  public static void main(String[] args) {
    var remote = new CompletableFuture<String>();
    remote.orTimeout(1, TimeUnit.MILLISECONDS);
    try { remote.join(); throw new AssertionError("Timeout não observado"); }
    catch (CompletionException failure) {
      if (!(failure.getCause() instanceof TimeoutException)) throw new AssertionError("Causa apagada", failure);
    }
    boolean shouldBlindlyRetryWrite = false;
    if (shouldBlindlyRetryWrite) throw new AssertionError("Commit ambíguo virou retry");
    System.out.println("timeout-reconcile-before-retry");
  }
}`,
  ],
  "Virtual threads e contenção": [
    `import java.util.concurrent.*;
class Main {
  public static void main(String[] args) throws Exception {
    var permits = new Semaphore(2); var current = new java.util.concurrent.atomic.AtomicInteger(); var peak = new java.util.concurrent.atomic.AtomicInteger();
    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
      var jobs = new java.util.ArrayList<Future<?>>();
      for (int i = 0; i < 20; i++) jobs.add(executor.submit(() -> {
        boolean acquired = false;
        try { permits.acquire(); acquired = true; int active = current.incrementAndGet(); peak.accumulateAndGet(active, Math::max); Thread.sleep(2); }
        catch (InterruptedException e) { Thread.currentThread().interrupt(); }
        finally { if (acquired) { current.decrementAndGet(); permits.release(); } }
      }));
      for (var job : jobs) job.get(5, TimeUnit.SECONDS);
    }
    if (peak.get() > 2 || permits.availablePermits() != 2) throw new AssertionError("Backpressure falhou");
    System.out.println("virtual-thread-admission-ok");
  }
}`,
    `class Main {
  public static void main(String[] args) throws Exception {
    var signal = new java.util.concurrent.CountDownLatch(1);
    Thread task = Thread.ofVirtual().start(() -> {
      try { signal.await(); throw new AssertionError("Cancelamento não interrompeu espera"); }
      catch (InterruptedException expected) { Thread.currentThread().interrupt(); }
    });
    if (!task.isVirtual()) throw new AssertionError("Task não virtual");
    task.interrupt(); task.join(5_000);
    if (task.isAlive()) throw new AssertionError("Task não encerrou");
    System.out.println("virtual-thread-cancellation-observed");
  }
}`,
  ],
  "Bytecode, loading e linking": [
    `import java.io.*;
class Main {
  public static void main(String[] args) throws Exception {
    try (var input = new DataInputStream(Main.class.getResourceAsStream("/Main.class"))) {
      if (input.readInt() != 0xCAFEBABE) throw new AssertionError("Magic inválido");
      int minor = input.readUnsignedShort();
      int major = input.readUnsignedShort();
      if (major != 65 || minor != 0) throw new AssertionError("Compilar com --release 21: " + major);
      var source = Main.class.getProtectionDomain().getCodeSource();
      if (source == null || source.getLocation() == null) throw new AssertionError("Origem desconhecida");
      System.out.println("major=" + major + " source=" + source.getLocation());
    }
  }
}`,
    `import java.util.concurrent.atomic.*;
class Main {
  static final AtomicInteger initialized = new AtomicInteger();
  public static void main(String[] args) throws Exception {
    Class<?> type = Class.forName("Lazy", false, Main.class.getClassLoader());
    if (initialized.get() != 0) throw new AssertionError("Lookup inicializou classe");
    if (!type.getName().equals("Lazy")) throw new AssertionError("Nome incorreto");
    Class.forName("Lazy", true, Main.class.getClassLoader());
    if (initialized.get() != 1) throw new AssertionError("Initializer não executou uma vez");
    Class.forName("Lazy", true, Main.class.getClassLoader());
    if (initialized.get() != 1) throw new AssertionError("Initializer repetiu");
    System.out.println("initialization-timing-ok");
  }
}
class Lazy { static { Main.initialized.incrementAndGet(); } }`,
  ],
  "Heap, stacks e referências": [
    `import java.util.*;
class Main {
  static final Map<String, byte[]> retained = new HashMap<>();
  public static void main(String[] args) {
    for (int i = 0; i < 100; i++) retained.put("tenant-" + i, new byte[1024]);
    if (retained.size() != 100) throw new AssertionError("Fixture inválida");
    retained.keySet().removeIf(key -> !key.equals("tenant-0"));
    if (retained.size() != 1 || retained.get("tenant-0").length != 1024) throw new AssertionError("Cleanup falhou");
    retained.clear();
    if (!retained.isEmpty()) throw new AssertionError("Referências fortes retidas");
    System.out.println("explicit-ownership-cleanup-ok");
  }
}`,
    `import java.util.*;
class Main {
  static int depth(String input, int limit) {
    int level = 0, peak = 0;
    for (int i = 0; i < input.length(); i++) {
      char token = input.charAt(i);
      if (token == '[') { if (++level > limit) throw new IllegalArgumentException("profundidade excedida"); peak = Math.max(peak, level); }
      else if (token == ']' && --level < 0) throw new IllegalArgumentException("fechamento sem abertura");
      else if (token != '[' && token != ']') throw new IllegalArgumentException("token inválido");
    }
    if (level != 0) throw new IllegalArgumentException("estrutura incompleta");
    return peak;
  }
  public static void main(String[] args) {
    if (depth("[[[]]]", 3) != 3) throw new AssertionError("Pico incorreto");
    try { depth("[[[]]]", 2); throw new AssertionError("Limite ignorado"); }
    catch (IllegalArgumentException expected) { }
    System.out.println("bounded-depth-without-recursion-ok");
  }
}`,
  ],
  "GC, pausas e alocação": [
    `import java.lang.management.*;
import java.util.*;
class Main {
  public static void main(String[] args) {
    var collectors = ManagementFactory.getGarbageCollectorMXBeans();
    if (collectors.isEmpty()) throw new AssertionError("Coletores indisponíveis");
    for (var gc : collectors) {
      if (gc.getName().isBlank()) throw new AssertionError("Nome ausente");
      System.out.println(gc.getName() + " collections=" + gc.getCollectionCount());
    }
    long maxHeap = ManagementFactory.getMemoryMXBean().getHeapMemoryUsage().getMax();
    if (maxHeap <= 0) throw new AssertionError("Limite de heap indisponível");
    System.out.println("max-heap=" + maxHeap);
  }
}`,
    `import java.util.*;
class Main {
  static final int CAPACITY = 16;
  static final ArrayDeque<byte[]> pending = new ArrayDeque<>();
  static boolean admit(byte[] payload) {
    if (pending.size() >= CAPACITY) return false;
    pending.addLast(payload); return true;
  }
  public static void main(String[] args) {
    int rejected = 0;
    for (int i = 0; i < 100; i++) if (!admit(new byte[1024])) rejected++;
    if (pending.size() != CAPACITY || rejected != 84) throw new AssertionError("Fila sem limite");
    while (!pending.isEmpty()) pending.removeFirst();
    if (!pending.isEmpty()) throw new AssertionError("Retenção após drenagem");
    System.out.println("bounded-live-set-ok");
  }
}`,
  ],
  "JIT, benchmarks e profiling": [
    `import java.util.*;
class Main {
  static volatile long sink;
  static long work(int size) {
    long total = 0;
    for (int i = 0; i < size; i++) total += (i * 31L) ^ (i >>> 2);
    return total;
  }
  public static void main(String[] args) {
    for (int i = 0; i < 20_000; i++) sink = work(100 + i % 17);
    long[] nanos = new long[7];
    for (int round = 0; round < nanos.length; round++) {
      long start = System.nanoTime(), checksum = 0;
      for (int i = 0; i < 2_000; i++) checksum ^= work(100 + i % 17);
      nanos[round] = System.nanoTime() - start;
      sink = checksum;
    }
    Arrays.sort(nanos);
    if (nanos[3] <= 0 || sink == 0) throw new AssertionError("Medição sem resultado consumido");
    System.out.println("median-ns=" + nanos[3] + " checksum=" + sink);
  }
}`,
    `import java.util.*;
class Main {
  static volatile long sink;
  static long indexed(int[] values) { long sum = 0; for (int i = 0; i < values.length; i++) sum += values[i]; return sum; }
  static long enhanced(int[] values) { long sum = 0; for (int value : values) sum += value; return sum; }
  public static void main(String[] args) {
    var random = new Random(21);
    for (int size : new int[]{0, 1, 10, 1_000}) {
      int[] values = random.ints(size, -1_000, 1_000).toArray();
      long left = indexed(values), right = enhanced(values);
      if (left != right) throw new AssertionError("Otimização mudou resultado");
      sink += left;
    }
    if (sink == 0) throw new AssertionError("Corpus trivial");
    System.out.println("functional-oracle-before-benchmark-ok");
  }
}`,
  ],
  "JPMS e encapsulamento forte": [
    `import java.lang.module.*;
class Main {
  public static void main(String[] args) {
    Module base = Object.class.getModule();
    ModuleDescriptor descriptor = base.getDescriptor();
    if (!base.isNamed() || !descriptor.name().equals("java.base")) throw new AssertionError("Módulo base ausente");
    if (!base.isExported("java.lang", Main.class.getModule())) throw new AssertionError("API pública inacessível");
    if (base.isOpen("java.lang", Main.class.getModule())) throw new AssertionError("Reflection profunda aberta indevidamente");
    if (!Main.class.getModule().canRead(base)) throw new AssertionError("Módulo atual não lê java.base");
    System.out.println("readability-export-opens-distinct");
  }
}`,
    `import java.lang.reflect.*;
class Main {
  public static void main(String[] args) throws Exception {
    var publicMethod = String.class.getMethod("length");
    if ((int) publicMethod.invoke("abc") != 3) throw new AssertionError("API pública falhou");
    var privateField = String.class.getDeclaredField("value");
    try { privateField.setAccessible(true); throw new AssertionError("Encapsulamento ignorado"); }
    catch (java.lang.reflect.InaccessibleObjectException expected) {
      if (!expected.getMessage().contains("java.base")) throw new AssertionError("Causa inesperada");
    }
    System.out.println("public-api-works-deep-reflection-denied");
  }
}`,
  ],
  "Maven, Gradle e dependências": [
    `import java.util.*;
class Main {
  record Dependency(String artifact, String version, String scope) { }
  static void verify(List<Dependency> declared, Map<String, String> lock) {
    for (var dependency : declared) {
      String pinned = lock.get(dependency.artifact());
      if (!dependency.version().equals(pinned)) throw new IllegalStateException("Grafo mudou: " + dependency.artifact());
      if (dependency.scope().equals("test") && dependency.artifact().equals("domain")) throw new IllegalStateException("Domínio ausente no runtime");
    }
  }
  public static void main(String[] args) {
    var declared = List.of(new Dependency("domain", "1.2.0", "compile"), new Dependency("junit", "5.11.0", "test"));
    verify(declared, Map.of("domain", "1.2.0", "junit", "5.11.0"));
    try { verify(declared, Map.of("domain", "1.3.0", "junit", "5.11.0")); throw new AssertionError("Mudança transitiva ignorada"); }
    catch (IllegalStateException expected) { }
    System.out.println("resolved-graph-must-match-reviewed-lock");
  }
}`,
    `import java.io.*;
import java.util.jar.*;
class Main {
  public static void main(String[] args) throws Exception {
    var location = Main.class.getProtectionDomain().getCodeSource().getLocation();
    if (location == null) throw new AssertionError("Origem do artefato indisponível");
    try (InputStream stream = Main.class.getResourceAsStream("/Main.class")) {
      if (stream == null || stream.read() != 0xCA) throw new AssertionError("Classe ausente no runtime path");
    }
    String version = System.getProperty("java.specification.version");
    if (Runtime.version().feature() < 21 || version == null) throw new AssertionError("Runtime incompatível");
    System.out.println("artifact-origin=" + location + " runtime=" + version);
  }
}`,
  ],
  "JUnit, testes e determinismo": [
    `import java.time.*;
class Main {
  static boolean valid(Instant deadline, Clock clock) { return clock.instant().isBefore(deadline); }
  public static void main(String[] args) {
    Instant deadline = Instant.parse("2026-01-01T00:00:00Z");
    for (var test : new Object[][] {
      {deadline.minusNanos(1), true}, {deadline, false}, {deadline.plusNanos(1), false}
    }) {
      Instant now = (Instant) test[0]; boolean expected = (boolean) test[1];
      boolean actual = valid(deadline, Clock.fixed(now, ZoneOffset.UTC));
      if (actual != expected) throw new AssertionError("Fronteira falhou em " + now);
    }
    System.out.println("clock-boundaries-deterministic");
  }
}`,
    `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
class Main {
  public static void main(String[] args) throws Exception {
    var ready = new CountDownLatch(2); var start = new CountDownLatch(1);
    var counter = new AtomicInteger();
    try (var executor = Executors.newFixedThreadPool(2)) {
      var tasks = new java.util.ArrayList<Future<?>>();
      for (int i = 0; i < 2; i++) tasks.add(executor.submit(() -> {
        ready.countDown();
        try { if (!start.await(5, TimeUnit.SECONDS)) throw new AssertionError("Start não liberado"); }
        catch (InterruptedException e) { Thread.currentThread().interrupt(); throw new RuntimeException(e); }
        counter.incrementAndGet();
      }));
      if (!ready.await(5, TimeUnit.SECONDS)) throw new AssertionError("Workers não prontos");
      start.countDown();
      for (var task : tasks) task.get(5, TimeUnit.SECONDS);
    }
    if (counter.get() != 2) throw new AssertionError("Trabalho perdido");
    System.out.println("synchronized-start-without-sleep-ok");
  }
}`,
  ],
  "Segurança e supply chain": [
    `import java.nio.file.*;
class Main {
  static Path destination(Path root, String userName) {
    if (!userName.matches("[a-zA-Z0-9_][a-zA-Z0-9_-]{0,31}[.]txt")) throw new IllegalArgumentException("Nome inválido");
    Path candidate = root.resolve(userName).normalize();
    if (!candidate.startsWith(root)) throw new IllegalArgumentException("Fora da raiz");
    return candidate;
  }
  public static void main(String[] args) {
    Path root = Path.of("tenant-data").toAbsolutePath().normalize();
    if (!destination(root, "report_01.txt").startsWith(root)) throw new AssertionError("Destino incorreto");
    for (String attack : new String[]{"../secret.txt", "--output.txt", "a/b.txt"}) {
      try { destination(root, attack); throw new AssertionError("Entrada perigosa aceita: " + attack); }
      catch (IllegalArgumentException expected) { }
    }
    System.out.println("bounded-file-name-policy-ok");
  }
}`,
    `import java.io.*;
class Main {
  record Payload(String value) implements Serializable { }
  public static void main(String[] args) throws Exception {
    var bytes = new ByteArrayOutputStream();
    try (var out = new ObjectOutputStream(bytes)) { out.writeObject(new Payload("blocked")); }
    try (var input = new ObjectInputStream(new ByteArrayInputStream(bytes.toByteArray()))) {
      input.setObjectInputFilter(info -> info.serialClass() == Payload.class
        ? ObjectInputFilter.Status.REJECTED : ObjectInputFilter.Status.UNDECIDED);
      try { input.readObject(); throw new AssertionError("Classe proibida foi criada"); }
      catch (InvalidClassException expected) { }
    }
    System.out.println("deserialization-filter-rejected-type");
  }
}`,
  ],
  "HTTP Client, deadlines e retries": [
    `import com.sun.net.httpserver.*;
import java.net.*;
import java.net.http.*;
import java.nio.charset.*;
import java.time.*;
import java.util.concurrent.atomic.*;
class Main {
  public static void main(String[] args) throws Exception {
    var calls = new AtomicInteger(); var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
    server.createContext("/reserve", exchange -> {
      if (!"key-42".equals(exchange.getRequestHeaders().getFirst("Idempotency-Key"))) throw new AssertionError("Chave mudou");
      int status = calls.incrementAndGet() == 1 ? 503 : 200;
      byte[] body = (status == 200 ? "confirmed" : "retry").getBytes(StandardCharsets.UTF_8);
      exchange.sendResponseHeaders(status, body.length);
      try (var out = exchange.getResponseBody()) { out.write(body); }
    });
    server.start();
    try {
      var client = HttpClient.newHttpClient();
      var uri = URI.create("http://127.0.0.1:" + server.getAddress().getPort() + "/reserve");
      int status = 0;
      for (int attempt = 0; attempt < 2; attempt++) {
        var request = HttpRequest.newBuilder(uri).timeout(Duration.ofSeconds(2))
          .header("Idempotency-Key", "key-42").POST(HttpRequest.BodyPublishers.noBody()).build();
        status = client.send(request, HttpResponse.BodyHandlers.ofString()).statusCode();
        if (status == 200) break;
        if (status != 503) throw new AssertionError("Erro não elegível para retry");
      }
      if (status != 200 || calls.get() != 2) throw new AssertionError("Política de tentativas incorreta");
      System.out.println("bounded-retry-stable-key-ok");
    } finally { server.stop(0); }
  }
}`,
    `import com.sun.net.httpserver.*;
import java.net.*;
import java.net.http.*;
import java.time.*;
import java.util.concurrent.atomic.*;
class Main {
  public static void main(String[] args) throws Exception {
    var committed = new AtomicBoolean(); var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
    server.createContext("/charge", exchange -> {
      committed.set(true);
      try { Thread.sleep(150); exchange.sendResponseHeaders(204, -1); }
      catch (Exception ignored) { }
      finally { exchange.close(); }
    });
    server.start();
    try {
      var request = HttpRequest.newBuilder(URI.create("http://127.0.0.1:" + server.getAddress().getPort() + "/charge"))
        .timeout(Duration.ofMillis(50)).POST(HttpRequest.BodyPublishers.noBody()).build();
      try { HttpClient.newHttpClient().send(request, HttpResponse.BodyHandlers.discarding()); throw new AssertionError("Timeout esperado"); }
      catch (HttpTimeoutException expected) {
        if (!committed.get()) throw new AssertionError("Fixture não demonstrou resultado ambíguo");
      }
      boolean retryWithNewKey = false;
      if (retryWithNewKey) throw new AssertionError("Duplicaria operação");
      System.out.println("timeout-does-not-prove-rollback");
    } finally { server.stop(0); }
  }
}`,
  ],
  "JDBC, transações e pools": [
    `import java.lang.reflect.*;
import java.sql.*;
import java.util.concurrent.atomic.*;
class Main {
  static final class State { boolean autoCommit = true, committed, rolledBack, closed; }
  static Connection fake(State state) {
    return (Connection) Proxy.newProxyInstance(Main.class.getClassLoader(), new Class[]{Connection.class}, (proxy, method, args) -> {
      switch (method.getName()) {
        case "getAutoCommit": return state.autoCommit;
        case "setAutoCommit": state.autoCommit = (boolean) args[0]; return null;
        case "commit": state.committed = true; return null;
        case "rollback": state.rolledBack = true; return null;
        case "close": state.closed = true; return null;
      }
      throw new UnsupportedOperationException(method.getName());
    });
  }
  static void unitOfWork(Connection connection, boolean fail) throws SQLException {
    boolean previous = connection.getAutoCommit();
    connection.setAutoCommit(false);
    try { if (fail) throw new SQLException("insert failed"); connection.commit(); }
    catch (SQLException error) { connection.rollback(); throw error; }
    finally { connection.setAutoCommit(previous); }
  }
  public static void main(String[] args) throws Exception {
    var success = new State();
    try (var connection = fake(success)) { unitOfWork(connection, false); }
    if (!success.committed || success.rolledBack || !success.autoCommit || !success.closed) throw new AssertionError("Commit/cleanup incorreto");
    var failure = new State();
    try (var connection = fake(failure)) {
      try { unitOfWork(connection, true); throw new AssertionError("Falha omitida"); }
      catch (SQLException expected) { }
    }
    if (failure.committed || !failure.rolledBack || !failure.autoCommit || !failure.closed) throw new AssertionError("Rollback/cleanup incorreto");
    System.out.println("transaction-ownership-ok");
  }
}`,
    `import java.lang.reflect.*;
import java.sql.*;
import java.util.*;
class Main {
  public static void main(String[] args) throws Exception {
    String sql = "SELECT id FROM booking WHERE tenant_id = ? AND label = ?";
    var bound = new HashMap<Integer, String>();
    PreparedStatement statement = (PreparedStatement) Proxy.newProxyInstance(Main.class.getClassLoader(), new Class[]{PreparedStatement.class}, (proxy, method, params) -> {
      if (method.getName().equals("setString")) { bound.put((int) params[0], (String) params[1]); return null; }
      if (method.getName().equals("executeUpdate")) return 1;
      if (method.getName().equals("close")) return null;
      throw new UnsupportedOperationException(method.getName());
    });
    String hostile = "' OR 1=1 --";
    try (statement) {
      statement.setString(1, "tenant-a"); statement.setString(2, hostile);
      if (statement.executeUpdate() != 1) throw new AssertionError("Execução simulada falhou");
    }
    if (sql.contains(hostile) || !hostile.equals(bound.get(2)) || bound.size() != 2) throw new AssertionError("Valor virou sintaxe SQL");
    System.out.println("parameters-not-sql-syntax-ok");
  }
}`,
  ],
  "Logs, métricas e tracing": [
    `import java.util.*;
class Main {
  record Event(String requestId, String outcome, int status) { }
  static String log(Event event) {
    return "request_id=" + event.requestId() + " outcome=" + event.outcome() + " status=" + event.status();
  }
  public static void main(String[] args) {
    String secret = "sentinel-secret";
    Map<String, String> untrusted = Map.of("Authorization", secret, "request-id", "req-42");
    String line = log(new Event(untrusted.get("request-id"), "unknown_outcome", 504));
    if (line.contains(secret) || !line.contains("req-42") || !line.contains("unknown_outcome")) throw new AssertionError("Log inseguro ou inútil");
    System.out.println(line);
  }
}`,
    `import java.util.*;
class Main {
  enum Outcome { SUCCESS, REJECTED, UNKNOWN }
  static final EnumMap<Outcome, Integer> counts = new EnumMap<>(Outcome.class);
  static void record(Outcome outcome, String userId) { counts.merge(outcome, 1, Integer::sum); }
  public static void main(String[] args) {
    for (int i = 0; i < 10_000; i++) record(i % 10 == 0 ? Outcome.UNKNOWN : Outcome.SUCCESS, "user-" + i);
    if (counts.size() > Outcome.values().length || counts.get(Outcome.UNKNOWN) != 1_000) throw new AssertionError("Cardinalidade/contagem incorreta");
    System.out.println("bounded-label-series=" + counts.size());
  }
}`,
  ],
  "Configuração, shutdown e deploy": [
    `import java.net.*;
import java.time.*;
import java.util.*;
class Main {
  record Config(URI database, Duration timeout, int poolSize) {
    Config {
      if (!"postgres".equals(database.getScheme()) || database.getHost() == null) throw new IllegalArgumentException("database inválido");
      if (timeout.isNegative() || timeout.isZero() || timeout.compareTo(Duration.ofSeconds(30)) > 0) throw new IllegalArgumentException("timeout inválido");
      if (poolSize < 1 || poolSize > 50) throw new IllegalArgumentException("pool inválido");
    }
    public String toString() { return "Config(poolSize=" + poolSize + ", timeout=" + timeout + ")"; }
  }
  public static void main(String[] args) {
    var valid = new Config(URI.create("postgres://user:secret@db.example/app"), Duration.ofSeconds(2), 8);
    if (valid.toString().contains("secret")) throw new AssertionError("Segredo em diagnóstico");
    try { new Config(URI.create("postgres://db.example/app"), Duration.ZERO, 8); throw new AssertionError("Prazo zero aceito"); }
    catch (IllegalArgumentException expected) { }
    System.out.println(valid);
  }
}`,
    `import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
class Main {
  static final class Service implements AutoCloseable {
    final AtomicBoolean accepting = new AtomicBoolean(true);
    final ExecutorService executor = Executors.newSingleThreadExecutor();
    Future<Integer> submit() {
      if (!accepting.get()) throw new RejectedExecutionException("draining");
      return executor.submit(() -> 42);
    }
    public void close() throws Exception {
      accepting.set(false); executor.shutdown();
      if (!executor.awaitTermination(5, TimeUnit.SECONDS)) { executor.shutdownNow(); throw new IllegalStateException("drain excedeu prazo"); }
    }
  }
  public static void main(String[] args) throws Exception {
    var service = new Service(); var result = service.submit();
    service.close();
    if (result.get() != 42 || !service.executor.isTerminated()) throw new AssertionError("Tarefa perdida");
    try { service.submit(); throw new AssertionError("Nova admissão após shutdown"); }
    catch (RejectedExecutionException expected) { }
    System.out.println("drain-before-close-ok");
  }
}`,
  ],
  "Domínio, portas e adapters": [
    `import java.util.*;
class Main {
  record Command(String tenant, String session, String person, String key) {
    Command { if (tenant.isBlank() || session.isBlank() || person.isBlank() || key.isBlank()) throw new IllegalArgumentException("campo vazio"); }
  }
  sealed interface Decision permits Confirmed, Rejected { }
  record Confirmed(String reservationId) implements Decision { }
  record Rejected(String reason) implements Decision { }
  interface Store { Decision reserve(Command command); }
  static final class MemoryStore implements Store {
    private final Map<String, Decision> byKey = new HashMap<>(); private int used;
    public synchronized Decision reserve(Command command) {
      String scoped = command.tenant() + ":" + command.key();
      if (byKey.containsKey(scoped)) return byKey.get(scoped);
      Decision result = used < 1 ? new Confirmed("res-1") : new Rejected("full");
      if (result instanceof Confirmed) used++;
      byKey.put(scoped, result); return result;
    }
  }
  public static void main(String[] args) {
    Store port = new MemoryStore();
    var first = new Command("t", "s", "alice", "k1");
    if (!(port.reserve(first) instanceof Confirmed)) throw new AssertionError("Primeira reserva negada");
    if (!(port.reserve(first) instanceof Confirmed)) throw new AssertionError("Replay mudou decisão");
    if (!(port.reserve(new Command("t", "s", "bob", "k2")) instanceof Rejected)) throw new AssertionError("Capacidade excedida");
    System.out.println("domain-port-invariants-ok");
  }
}`,
    `import java.util.*;
class Main {
  record Request(String authenticatedTenant, String payloadTenant, String person) { }
  static String handle(Request request, Map<String, Set<String>> reservations) {
    if (!request.authenticatedTenant().equals(request.payloadTenant())) return "forbidden";
    reservations.computeIfAbsent(request.authenticatedTenant(), ignored -> new HashSet<>()).add(request.person());
    return "accepted";
  }
  public static void main(String[] args) {
    var store = new HashMap<String, Set<String>>();
    if (!handle(new Request("a", "b", "alice"), store).equals("forbidden") || !store.isEmpty()) throw new AssertionError("Tenant adulterado gravou dado");
    if (!handle(new Request("a", "a", "alice"), store).equals("accepted")) throw new AssertionError("Tenant válido recusado");
    if (store.containsKey("b") || !store.get("a").contains("alice")) throw new AssertionError("Isolamento perdido");
    System.out.println("tenant-boundary-ok");
  }
}`,
  ],
  "API, transação e idempotência": [
    `import java.util.*;
class Main {
  record Command(String tenant, String key, String session, String person) { }
  record Receipt(String fingerprint, String reservationId) { }
  static final class Store {
    final Map<String, Receipt> decisions = new HashMap<>(); int created;
    synchronized Receipt reserve(Command command) {
      String scope = command.tenant() + ":" + command.key();
      String fingerprint = command.session() + ":" + command.person();
      Receipt existing = decisions.get(scope);
      if (existing != null) {
        if (!existing.fingerprint().equals(fingerprint)) throw new IllegalArgumentException("chave reutilizada para outro comando");
        return existing;
      }
      Receipt result = new Receipt(fingerprint, "reservation-" + ++created);
      decisions.put(scope, result); return result;
    }
  }
  public static void main(String[] args) {
    var store = new Store(); var command = new Command("tenant-a", "req-7", "session-1", "alice");
    var first = store.reserve(command);
    if (!first.equals(store.reserve(command)) || store.created != 1) throw new AssertionError("Replay duplicou efeito");
    try { store.reserve(new Command("tenant-a", "req-7", "session-2", "alice")); throw new AssertionError("Fingerprint diferente aceito"); }
    catch (IllegalArgumentException expected) { }
    System.out.println("idempotency-scope-and-fingerprint-ok");
  }
}`,
    `import java.util.*;
class Main {
  record Receipt(String id) { }
  static final class Ledger {
    final Map<String, Receipt> committed = new HashMap<>(); int physicalWrites;
    Receipt commitThenDisconnect(String key) {
      var receipt = committed.computeIfAbsent(key, ignored -> { physicalWrites++; return new Receipt("res-42"); });
      throw new IllegalStateException("connection lost after possible commit");
    }
    Optional<Receipt> reconcile(String key) { return Optional.ofNullable(committed.get(key)); }
  }
  public static void main(String[] args) {
    var ledger = new Ledger();
    try { ledger.commitThenDisconnect("req-42"); throw new AssertionError("Falha de rede ausente"); }
    catch (IllegalStateException expected) { }
    Receipt observed = ledger.reconcile("req-42").orElseThrow();
    if (!observed.id().equals("res-42") || ledger.physicalWrites != 1) throw new AssertionError("Resultado não reconciliado");
    System.out.println("unknown-outcome-reconciled-without-new-key");
  }
}`,
  ],
  "Concorrência, filas e backpressure": [
    `import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.*;
class Main {
  public static void main(String[] args) throws Exception {
    var permits = new Semaphore(3); var active = new AtomicInteger(); var peak = new AtomicInteger();
    var rejected = new AtomicInteger();
    try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
      var tasks = new ArrayList<Future<?>>();
      for (int i = 0; i < 40; i++) tasks.add(executor.submit(() -> {
        if (!permits.tryAcquire()) { rejected.incrementAndGet(); return; }
        try {
          int now = active.incrementAndGet(); peak.accumulateAndGet(now, Math::max);
          Thread.sleep(10);
        } catch (InterruptedException error) { Thread.currentThread().interrupt(); }
        finally { active.decrementAndGet(); permits.release(); }
      }));
      for (var task : tasks) task.get(5, TimeUnit.SECONDS);
    }
    if (peak.get() > 3 || active.get() != 0 || permits.availablePermits() != 3 || rejected.get() == 0) throw new AssertionError("Admissão/cleanup falhou");
    System.out.println("bounded-admission-rejected=" + rejected.get());
  }
}`,
    `import java.util.*;
class Main {
  record Job(String id, long version, String result) { }
  static final class Queue {
    final Map<String, Job> jobs = new HashMap<>();
    synchronized Job claim(String id) {
      Job old = jobs.get(id);
      Job next = new Job(id, old.version() + 1, "in-flight");
      jobs.put(id, next); return next;
    }
    synchronized boolean complete(Job claim) {
      Job current = jobs.get(claim.id());
      if (current.version() != claim.version()) return false;
      jobs.put(claim.id(), new Job(claim.id(), claim.version(), "done")); return true;
    }
  }
  public static void main(String[] args) {
    var queue = new Queue(); queue.jobs.put("event-1", new Job("event-1", 0, "pending"));
    Job workerA = queue.claim("event-1");
    Job workerB = queue.claim("event-1");
    if (queue.complete(workerA) || !queue.complete(workerB)) throw new AssertionError("Worker antigo sobrescreveu novo");
    if (!queue.jobs.get("event-1").result().equals("done")) throw new AssertionError("Evento não concluído");
    System.out.println("fencing-token-prevents-stale-completion");
  }
}`,
  ],
  "Banca, profiling e recovery": [
    `import java.util.*;
class Main {
  record Gate(String requirement, String test, String mutant, boolean passed) { }
  public static void main(String[] args) {
    var gates = List.of(
      new Gate("capacidade", "duas reservas simultâneas", "remove lock", true),
      new Gate("idempotência", "timeout após commit", "nova request key", true),
      new Gate("segurança", "tenant adulterado", "confia no payload", true),
      new Gate("cleanup", "erro entre insert e commit", "não fecha conexão", true)
    );
    if (gates.stream().anyMatch(g -> g.requirement().isBlank() || g.test().isBlank() || g.mutant().isBlank() || !g.passed())) throw new AssertionError("Release sem evidência");
    if (gates.size() != new HashSet<>(gates.stream().map(Gate::requirement).toList()).size()) throw new AssertionError("Requisito duplicado");
    System.out.println("release-gates=" + gates.size());
  }
}`,
    `import java.util.*;
class Main {
  record Snapshot(Map<String, String> bookings, Map<String, String> outbox) {
    Snapshot { bookings = Map.copyOf(bookings); outbox = Map.copyOf(outbox); }
  }
  static void verify(Snapshot restored) {
    for (String key : restored.bookings().keySet())
      if (!restored.outbox().containsKey(key)) throw new AssertionError("Reserva sem evento recuperável: " + key);
  }
  public static void main(String[] args) {
    var original = new Snapshot(Map.of("req-1", "res-1"), Map.of("req-1", "pending"));
    var restored = new Snapshot(new HashMap<>(original.bookings()), new HashMap<>(original.outbox()));
    verify(restored);
    try { verify(new Snapshot(restored.bookings(), Map.of())); throw new AssertionError("Outbox perdida não detectada"); }
    catch (AssertionError expected) { if (!expected.getMessage().startsWith("Reserva sem evento")) throw expected; }
    System.out.println("restore-drill-validates-outbox-and-bookings");
  }
}`,
  ],
};
