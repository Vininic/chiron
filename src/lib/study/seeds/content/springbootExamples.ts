export type SpringBootExample = { lang: "java" | "xml" | "kotlin" | "sql" | "yaml"; code: string; purpose: string };

/** Exemplos autorais; não declarar executados sem o gate de build Spring Boot real. */
export const SPRING_BOOT_EXAMPLES: Record<string, [SpringBootExample, SpringBootExample]> = {
  "Starter, BOM e compatibilidade": [
    { lang: "xml", purpose: "POM completo com linha do Boot e release Java explícitos.", code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.1.1</version>
    <relativePath/>
  </parent>
  <groupId>br.dev.quiron</groupId>
  <artifactId>reservas</artifactId>
  <version>1.0.0</version>
  <properties><java.version>21</java.version></properties>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-webmvc</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-webmvc-test</artifactId><scope>test</scope></dependency>
  </dependencies>
  <build><plugins><plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin></plugins></build>
</project>` },
    { lang: "java", purpose: "Entrypoint e endpoint mínimo que precisam rodar a partir do JAR empacotado.", code: `package br.dev.quiron;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class ReservasApplication {
  public static void main(String[] args) {
    SpringApplication.run(ReservasApplication.class, args);
  }
}

@RestController
class ProbeController {
  @GetMapping("/ready-demo")
  String probe() { return "started"; }
}` },
  ],
  "SpringApplication e ciclo de startup": [
    { lang: "java", purpose: "Falhar no startup quando o requisito essencial não existe, sem imprimir segredo.", code: `package br.dev.quiron;

import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.env.Environment;

@SpringBootApplication
public class ReservasApplication {
  public static void main(String[] args) {
    SpringApplication.run(ReservasApplication.class, args);
  }

  @Bean
  ApplicationRunner validateDatabase(Environment environment) {
    return ignored -> {
      String value = environment.getProperty("quiron.database.url");
      if (value == null || value.isBlank())
        throw new IllegalStateException("Configuração obrigatória ausente: quiron.database.url");
    };
  }
}` },
    { lang: "java", purpose: "Drenar uma fila de trabalho de propriedade do bean no fechamento do contexto.", code: `package br.dev.quiron;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.springframework.stereotype.Component;

@Component
class WorkerOwner implements AutoCloseable {
  private final ExecutorService executor = Executors.newSingleThreadExecutor();
  private volatile boolean accepting = true;

  synchronized void submit(Runnable task) {
    if (!accepting) throw new IllegalStateException("draining");
    executor.submit(task);
  }

  @Override public synchronized void close() throws InterruptedException {
    accepting = false;
    executor.shutdown();
    if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
      executor.shutdownNow();
      throw new IllegalStateException("drain excedeu prazo");
    }
  }
}` },
  ],
  "Component scan e organização de packages": [
    { lang: "java", purpose: "Composição por construtor, mantendo o caso de uso independente da descoberta.", code: `package br.dev.quiron;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Repository;

interface ReservationStore { boolean reserve(String key); }

final class ReserveUseCase {
  private final ReservationStore store;
  ReserveUseCase(ReservationStore store) { this.store = store; }
  boolean execute(String key) { return store.reserve(key); }
}

@Repository
class MemoryReservationStore implements ReservationStore {
  private final java.util.Set<String> keys = java.util.concurrent.ConcurrentHashMap.newKeySet();
  public boolean reserve(String key) { return keys.add(key); }
}

@Configuration
class DomainWiring {
  @Bean ReserveUseCase reserveUseCase(ReservationStore store) { return new ReserveUseCase(store); }
}` },
    { lang: "java", purpose: "Teste de contexto que detecta bean ausente ou adapter duplicado.", code: `package br.dev.quiron;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;

@SpringBootTest(classes = ReservasApplication.class)
class WiringTest {
  @Autowired ApplicationContext context;

  @Test void exactlyOneStoreIsWired() {
    assertEquals(1, context.getBeansOfType(ReservationStore.class).size());
    assertNotNull(context.getBean(ReserveUseCase.class));
  }
}` },
  ],
  "Auto-configuration e conditions": [
    { lang: "java", purpose: "Capacidade opcional apenas sob property explícita e na ausência de bean do consumidor.", code: `package br.dev.quiron;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

interface ReceiptPublisher { void publish(String requestKey); }

@Configuration(proxyBeanMethods = false)
class ReceiptConfiguration {
  @Bean
  @ConditionalOnProperty(prefix = "quiron.receipts", name = "enabled", havingValue = "true")
  @ConditionalOnMissingBean(ReceiptPublisher.class)
  ReceiptPublisher receiptPublisher() { return requestKey -> System.out.println("queued " + requestKey); }
}` },
    { lang: "java", purpose: "Matriz de condições: desligada, ligada e sobrescrita por bean do consumidor.", code: `package br.dev.quiron;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;

class ReceiptConfigurationTest {
  private final ApplicationContextRunner runner = new ApplicationContextRunner()
    .withUserConfiguration(ReceiptConfiguration.class);

  @Test void disabledByDefault() {
    runner.run(context -> assertThat(context).doesNotHaveBean(ReceiptPublisher.class));
  }

  @Test void enabledExactlyOnce() {
    runner.withPropertyValues("quiron.receipts.enabled=true").run(context ->
      assertThat(context).hasSingleBean(ReceiptPublisher.class));
  }

  @Test void userBeanWins() {
    runner.withPropertyValues("quiron.receipts.enabled=true")
      .withBean(ReceiptPublisher.class, () -> ignored -> {})
      .run(context -> assertThat(context).hasSingleBean(ReceiptPublisher.class));
  }
}` },
  ],
  "Injeção por construtor e dependências": [
    { lang: "java", purpose: "Caso de uso construível fora do contexto, com dependências obrigatórias.", code: `package br.dev.quiron.domain;

import java.time.Clock;
import java.time.Instant;
import java.util.Objects;

public final class ReserveUseCase {
  public interface Store { boolean reserve(String tenant, String key, Instant at); }
  private final Store store;
  private final Clock clock;

  public ReserveUseCase(Store store, Clock clock) {
    this.store = Objects.requireNonNull(store);
    this.clock = Objects.requireNonNull(clock);
  }

  public boolean execute(String tenant, String key) {
    if (tenant.isBlank() || key.isBlank()) throw new IllegalArgumentException("empty input");
    return store.reserve(tenant, key, clock.instant());
  }
}` },
    { lang: "java", purpose: "Configuração de produção escolhe um adapter e injeta a mesma porta por construtor.", code: `package br.dev.quiron.config;

import br.dev.quiron.domain.ReserveUseCase;
import java.time.Clock;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
public class ReserveWiring {
  @Bean Clock clock() { return Clock.systemUTC(); }

  @Bean ReserveUseCase reserveUseCase(ReserveUseCase.Store store, Clock clock) {
    return new ReserveUseCase(store, clock);
  }
}` },
  ],
  "Escopos e lifecycle de beans": [
    { lang: "java", purpose: "Service singleton sem estado de request em campos.", code: `package br.dev.quiron.service;

import org.springframework.stereotype.Service;

@Service
public final class TenantReservationService {
  private final ReservationStore store;

  public TenantReservationService(ReservationStore store) { this.store = store; }

  public boolean reserve(String authenticatedTenant, String requestKey) {
    if (authenticatedTenant == null || authenticatedTenant.isBlank())
      throw new IllegalArgumentException("tenant missing");
    return store.reserve(authenticatedTenant, requestKey);
  }
}

interface ReservationStore { boolean reserve(String tenant, String requestKey); }` },
    { lang: "java", purpose: "Executor tem owner e fechamento; payload do trabalho não depende de request scope.", code: `package br.dev.quiron.service;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import org.springframework.stereotype.Component;

record Work(String tenant, String requestKey) { }

@Component
public final class OutboxWorker implements AutoCloseable {
  private final ExecutorService executor = Executors.newSingleThreadExecutor();
  private volatile boolean draining;

  public synchronized void enqueue(Work work) {
    if (draining) throw new IllegalStateException("draining");
    executor.submit(() -> process(work));
  }

  private void process(Work work) { System.out.println(work.requestKey()); }

  @Override public synchronized void close() throws InterruptedException {
    draining = true;
    executor.shutdown();
    if (!executor.awaitTermination(5, TimeUnit.SECONDS)) executor.shutdownNow();
  }
}` },
  ],
  "Profiles, properties e binding": [
    { lang: "java", purpose: "Binding tipado com invariantes relacionadas, sem segredo em toString.", code: `package br.dev.quiron.config;

import java.net.URI;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "quiron.reservations")
public record ReservationProperties(URI provider, Duration deadline, Duration connectTimeout, int maxInFlight) {
  public ReservationProperties {
    if (provider == null || !"https".equals(provider.getScheme())) throw new IllegalArgumentException("provider must use https");
    if (deadline == null || connectTimeout == null || connectTimeout.isNegative()
        || connectTimeout.isZero() || deadline.compareTo(connectTimeout) <= 0)
      throw new IllegalArgumentException("invalid deadline budget");
    if (maxInFlight < 1 || maxInFlight > 100) throw new IllegalArgumentException("invalid admission limit");
  }
}` },
    { lang: "java", purpose: "Habilitação explícita de properties e prova de falha no contexto inválido.", code: `package br.dev.quiron.config;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
@EnableConfigurationProperties(ReservationProperties.class)
class ReservationConfiguration { }

class ReservationPropertiesTest {
  private final ApplicationContextRunner runner = new ApplicationContextRunner()
    .withUserConfiguration(ReservationConfiguration.class)
    .withPropertyValues("quiron.reservations.provider=https://provider.example",
      "quiron.reservations.connect-timeout=1s", "quiron.reservations.max-in-flight=8");

  @Test void rejectsImpossibleDeadline() {
    runner.withPropertyValues("quiron.reservations.deadline=500ms")
      .run(context -> assertThat(context).hasFailed());
  }
}` },
  ],
  "Portas, adapters e configuração explícita": [
    { lang: "java", purpose: "Contrato da porta distingue decisão durável, conflito e falha técnica.", code: `package br.dev.quiron.domain;

public interface ReservationPort {
  record Command(String tenant, String requestKey, String session, String person) { }
  sealed interface Decision permits Confirmed, Full, KeyConflict, Unknown { }
  record Confirmed(String reservationId) implements Decision { }
  record Full(String session) implements Decision { }
  record KeyConflict(String requestKey) implements Decision { }
  record Unknown(String requestKey) implements Decision { }

  Decision reserve(Command command);
  Decision reconcile(String tenant, String requestKey);
}` },
    { lang: "java", purpose: "Controller mapeia a decisão sem colocar HTTP no núcleo.", code: `package br.dev.quiron.api;

import br.dev.quiron.domain.ReservationPort;
import java.security.Principal;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reservations")
public class ReservationController {
  private final ReservationPort port;
  public ReservationController(ReservationPort port) { this.port = port; }

  @PostMapping
  public ResponseEntity<String> reserve(@RequestHeader("Idempotency-Key") String key,
      Principal principal, @RequestBody CreateReservation body) {
    // A configuração de autenticação deste serviço define o nome do principal como tenant.
    String tenant = principal.getName();
    var decision = port.reserve(new ReservationPort.Command(tenant, key, body.session(), body.person()));
    return switch (decision) {
      case ReservationPort.Confirmed confirmed -> ResponseEntity.status(HttpStatus.CREATED).body(confirmed.reservationId());
      case ReservationPort.Full ignored -> ResponseEntity.status(HttpStatus.CONFLICT).body("session full");
      case ReservationPort.KeyConflict ignored -> ResponseEntity.status(HttpStatus.CONFLICT).body("request key conflict");
      case ReservationPort.Unknown ignored -> ResponseEntity.status(HttpStatus.ACCEPTED).body("check status by key");
    };
  }
}

record CreateReservation(String session, String person) { }` },
  ],
  "Controllers, rotas e representação": [
    { lang: "java", purpose: "Rota de reserva com DTO, status e chave; tenant vem do principal autenticado.", code: `package br.dev.quiron.api;

import java.security.Principal;
import java.net.URI;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/v1/reservations", produces = MediaType.APPLICATION_JSON_VALUE)
class ReservationController {
  private final ReserveService service;
  ReservationController(ReserveService service) { this.service = service; }

  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  ResponseEntity<ReservationResponse> create(@RequestHeader("Idempotency-Key") String key,
      Principal principal, @RequestBody CreateReservationRequest request) {
    // A autenticação do projeto define principal.getName() como tenant.
    var result = service.reserve(principal.getName(), key, request.session(), request.person());
    return ResponseEntity.created(URI.create("/v1/reservations/" + result.id()))
      .body(new ReservationResponse(result.id(), "confirmed"));
  }
}

record CreateReservationRequest(String session, String person) { }
record ReservationResponse(String id, String status) { }
interface ReserveService {
  Receipt reserve(String tenant, String key, String session, String person);
  record Receipt(String id) { }
}` },
    { lang: "java", purpose: "Teste de contrato HTTP distingue criação, media type e serialização permitida.", code: `package br.dev.quiron.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@WebMvcTest(ReservationController.class)
class ReservationControllerTest {
  @Autowired MockMvc mvc;
  @MockitoBean ReserveService service;

  @Test void createsResourceWithExplicitRepresentation() throws Exception {
    when(service.reserve(eq("tenant-a"), eq("req-7"), eq("session-1"), eq("alice")))
      .thenReturn(new ReserveService.Receipt("res-42"));
    mvc.perform(post("/v1/reservations").principal(() -> "tenant-a")
        .header("Idempotency-Key", "req-7").contentType("application/json")
        .content("{\\"session\\":\\"session-1\\",\\"person\\":\\"alice\\"}"))
      .andExpect(status().isCreated())
      .andExpect(header().string("Location", "/v1/reservations/res-42"))
      .andExpect(jsonPath("$.id").value("res-42"))
      .andExpect(jsonPath("$.status").value("confirmed"));
  }
}` },
  ],
  "Binding, validação e erros": [
    { lang: "java", purpose: "DTO com Bean Validation e envelope de erro estável, sem ecoar valor sensível.", code: `package br.dev.quiron.api;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

record CreateReservation(@NotBlank @Size(max = 64) String session,
                         @NotBlank @Size(max = 80) String person) { }
record ApiError(String code, String message) { }

@RestController
class ValidatedReservationController {
  @PostMapping("/validated-reservations")
  ResponseEntity<Void> create(@Valid @RequestBody CreateReservation request) {
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }
}

@RestControllerAdvice
class ApiErrorAdvice {
  @ExceptionHandler(MethodArgumentNotValidException.class)
  ResponseEntity<ApiError> invalid(MethodArgumentNotValidException ignored) {
    return ResponseEntity.badRequest().body(new ApiError("INVALID_REQUEST", "Confira os campos enviados."));
  }
}` },
    { lang: "java", purpose: "Teste de fronteira que reprova corpo inválido sem depender do texto localizado.", code: `package br.dev.quiron.api;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(ValidatedReservationController.class)
@Import(ApiErrorAdvice.class)
class ValidationBoundaryTest {
  @Autowired MockMvc mvc;

  @Test void rejectsBlankPersonWithStableCode() throws Exception {
    mvc.perform(post("/validated-reservations").contentType("application/json")
        .content("{\\"session\\":\\"s-1\\",\\"person\\":\\"\\"}"))
      .andExpect(status().isBadRequest())
      .andExpect(jsonPath("$.code").value("INVALID_REQUEST"));
  }
}` },
  ],
  "Filtros, interceptors e contexto": [
    { lang: "java", purpose: "Filtro de correlação valida header e limpa MDC mesmo se o controller falhar.", code: `package br.dev.quiron.api;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public final class RequestIdFilter extends OncePerRequestFilter {
  @Override protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
    String candidate = request.getHeader("X-Request-ID");
    String requestId = candidate != null && candidate.matches("[A-Za-z0-9_-]{1,64}")
      ? candidate : UUID.randomUUID().toString();
    MDC.put("requestId", requestId);
    response.setHeader("X-Request-ID", requestId);
    try { chain.doFilter(request, response); }
    finally { MDC.remove("requestId"); }
  }
}` },
    { lang: "java", purpose: "Contraprova: duas chamadas não compartilham id nem aceitam header hostil.", code: `package br.dev.quiron.api;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.MDC;

@RestController class EchoController { @GetMapping("/echo") String echo() { return "ok"; } }

@WebMvcTest(EchoController.class)
@Import(RequestIdFilter.class)
class RequestIdFilterTest {
  @Autowired MockMvc mvc;
  @Test void cleansContextAndRejectsHostileHeader() throws Exception {
    mvc.perform(get("/echo").header("X-Request-ID", "safe-42"))
      .andExpect(status().isOk()).andExpect(header().string("X-Request-ID", "safe-42"));
    assertNull(MDC.get("requestId"));
    mvc.perform(get("/echo").header("X-Request-ID", "bad value with spaces"))
      .andExpect(status().isOk()).andExpect(header().exists("X-Request-ID"));
    assertNull(MDC.get("requestId"));
  }
}` },
  ],
  "Uploads, downloads e streaming": [
    { lang: "java", purpose: "Upload em chunks com limite de bytes, nome gerado pelo servidor e cleanup do temporário.", code: `package br.dev.quiron.api;

import java.io.InputStream;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
class UploadController {
  private static final long MAX_BYTES = 10L * 1024 * 1024;
  private final Path root;
  UploadController(@Value("\${quiron.upload.root}") String rootPath) throws IOException {
    this.root = Files.createDirectories(Path.of(rootPath)).toRealPath();
  }

  @PostMapping(path = "/uploads", consumes = "multipart/form-data")
  ResponseEntity<String> upload(@RequestParam("file") MultipartFile file) throws Exception {
    if (file.getSize() > MAX_BYTES) return ResponseEntity.status(413).build();
    Path temporary = Files.createTempFile(root, "incoming-", ".tmp");
    try {
      long total = 0;
      try (InputStream input = file.getInputStream(); var output = Files.newOutputStream(temporary)) {
        byte[] buffer = new byte[8192]; int read;
        while ((read = input.read(buffer)) != -1) {
          total += read;
          if (total > MAX_BYTES) return ResponseEntity.status(413).build();
          output.write(buffer, 0, read);
        }
      }
      String id = UUID.randomUUID().toString();
      Files.move(temporary, root.resolve(id + ".bin"), StandardCopyOption.ATOMIC_MOVE);
      return ResponseEntity.status(201).body(id);
    } finally { Files.deleteIfExists(temporary); }
  }
}` },
    { lang: "java", purpose: "Download delega autorização ao store e retorna Resource sem carregar arquivo inteiro.", code: `package br.dev.quiron.api;

import java.security.Principal;
import org.springframework.core.io.Resource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
class DownloadController {
  private final AuthorizedFileStore store;
  DownloadController(AuthorizedFileStore store) { this.store = store; }

  @GetMapping("/uploads/{id}")
  ResponseEntity<Resource> download(@PathVariable String id, Principal principal) {
    Resource resource = store.openForTenant(principal.getName(), id);
    return ResponseEntity.ok()
      .contentType(MediaType.APPLICATION_OCTET_STREAM)
      .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename("download.bin").build().toString())
      .body(resource);
  }
}

interface AuthorizedFileStore { Resource openForTenant(String tenant, String id); }` },
  ],
  "DataSource, JdbcClient e SQL": [
    { lang: "java", purpose: "Consulta isolada por tenant e chave com parâmetros nomeados.", code: `package br.dev.quiron.data;

import java.util.Optional;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

record ReservationRow(String id, String status) { }

@Repository
public final class JdbcReservationReader {
  private final JdbcClient jdbc;
  public JdbcReservationReader(JdbcClient jdbc) { this.jdbc = jdbc; }

  public Optional<ReservationRow> find(String tenant, String requestKey) {
    return jdbc.sql("""
        select id, status from reservation
        where tenant_id = :tenant and request_key = :requestKey
        """)
      .param("tenant", tenant)
      .param("requestKey", requestKey)
      .query((rs, row) -> new ReservationRow(rs.getString("id"), rs.getString("status")))
      .optional();
  }
}` },
    { lang: "sql", purpose: "Constraint durável impede replay duplicado mesmo sob duas conexões.", code: `create table reservation (
  id varchar(64) primary key,
  tenant_id varchar(64) not null,
  request_key varchar(128) not null,
  fingerprint varchar(128) not null,
  status varchar(32) not null,
  unique (tenant_id, request_key)
);

create index reservation_tenant_status_idx
  on reservation (tenant_id, status);` },
  ],
  "Spring Data JPA e entidades": [
    { lang: "java", purpose: "Entidade adapter e repository com tenant em toda consulta sensível.", code: `package br.dev.quiron.data;

import jakarta.persistence.*;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

@Entity
@Table(name = "reservation", uniqueConstraints = @UniqueConstraint(columnNames = {"tenant_id", "request_key"}))
class ReservationEntity {
  @Id UUID id;
  @Column(name = "tenant_id", nullable = false) String tenantId;
  @Column(name = "request_key", nullable = false) String requestKey;
  @Column(nullable = false) String status;
  @Version long version;

  protected ReservationEntity() { }
  ReservationEntity(UUID id, String tenantId, String requestKey, String status) {
    this.id = id; this.tenantId = tenantId; this.requestKey = requestKey; this.status = status;
  }
}

interface ReservationJpaRepository extends JpaRepository<ReservationEntity, UUID> {
  Optional<ReservationEntity> findByTenantIdAndRequestKey(String tenantId, String requestKey);
}` },
    { lang: "java", purpose: "Projeção paginada evita serializar entidade gerenciada e expor campos internos.", code: `package br.dev.quiron.data;

import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

record ReservationSummary(UUID id, String status) { }

interface ReservationSummaryRepository extends Repository<ReservationEntity, UUID> {
  @Query("""
    select new br.dev.quiron.data.ReservationSummary(r.id, r.status)
    from ReservationEntity r
    where r.tenantId = :tenant
    order by r.id
    """)
  List<ReservationSummary> listForTenant(@Param("tenant") String tenant, Pageable page);
}` },
  ],
  "@Transactional, proxies e rollback": [
    { lang: "java", purpose: "Boundary público interceptável mantém reserva, chave e outbox no mesmo commit.", code: `package br.dev.quiron.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReservationTransaction {
  private final JdbcClient jdbc;
  public ReservationTransaction(JdbcClient jdbc) { this.jdbc = jdbc; }

  @Transactional
  public void confirm(String tenant, String key, String reservationId) {
    jdbc.sql("insert into request_key(tenant_id, request_key, reservation_id) values (?, ?, ?)")
      .params(tenant, key, reservationId).update();
    jdbc.sql("insert into reservation(id, tenant_id, status) values (?, ?, ?)")
      .params(reservationId, tenant, "confirmed").update();
    jdbc.sql("insert into outbox(event_id, tenant_id, reservation_id) values (?, ?, ?)")
      .params(key, tenant, reservationId).update();
  }
}` },
    { lang: "java", purpose: "TransactionTemplate torna escopo explícito quando a chamada não passa por proxy externo.", code: `package br.dev.quiron.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

@Component
public final class ExplicitReservationTransaction {
  private final TransactionTemplate transactions;
  private final JdbcClient jdbc;
  public ExplicitReservationTransaction(TransactionTemplate transactions, JdbcClient jdbc) {
    this.transactions = transactions; this.jdbc = jdbc;
  }

  public void confirm(String tenant, String key) {
    transactions.executeWithoutResult(status -> {
      jdbc.sql("insert into request_key(tenant_id, request_key) values (?, ?)")
        .params(tenant, key).update();
      jdbc.sql("insert into outbox(event_id, tenant_id) values (?, ?)")
        .params(key, tenant).update();
    });
  }
}` },
  ],
  "Migrations, isolamento e idempotência": [
    { lang: "sql", purpose: "Migration de expansão PostgreSQL mantém schema compatível durante deploy misto.", code: `-- V2__expand_reservation_protocol.sql (PostgreSQL)
alter table reservation add column fingerprint varchar(128);
alter table reservation add column lifecycle_status varchar(24);

update reservation set lifecycle_status = 'confirmed'
where lifecycle_status is null;

create table reservation_outbox (
  event_id varchar(128) primary key,
  tenant_id varchar(64) not null,
  reservation_id varchar(64) not null,
  state varchar(24) not null default 'pending',
  attempt_count integer not null default 0
);

create unique index reservation_tenant_key_unique
  on reservation (tenant_id, request_key);` },
    { lang: "sql", purpose: "Gate de dados antes do contract: duplicatas, nulos e outbox pendente são observáveis.", code: `-- Executar no PostgreSQL de staging após o backfill e antes do contract.
select tenant_id, request_key, count(*) as copies
from reservation
group by tenant_id, request_key
having count(*) > 1;

select count(*) as missing_fingerprint
from reservation
where fingerprint is null;

select state, count(*) as events
from reservation_outbox
group by state
order by state;

-- Somente depois de zero nulos e de drenar leitores antigos:
-- alter table reservation alter column fingerprint set not null;` },
  ],
  "SecurityFilterChain e regras HTTP": [
    { lang: "java", purpose: "Política HTTP explícita: health mínimo público, administração restrita e demais rotas autenticadas.", code: `package br.dev.quiron.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration(proxyBeanMethods = false)
public class HttpSecurityConfiguration {
  @Bean
  SecurityFilterChain applicationChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(authorize -> authorize
      .requestMatchers(HttpMethod.GET, "/actuator/health").permitAll()
      .requestMatchers("/admin/**").hasRole("ADMIN")
      .requestMatchers(HttpMethod.POST, "/v1/reservations").authenticated()
      .anyRequest().denyAll());
    return http.build();
  }
}` },
    { lang: "java", purpose: "Matriz de autorização reprova rota administrativa sem papel e novo path não mapeado.", code: `package br.dev.quiron.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AuthorizationMatrixTest {
  @Autowired MockMvc mvc;

  @Test void anonymousCannotReadAdmin() throws Exception {
    mvc.perform(get("/admin/audit")).andExpect(status().isUnauthorized());
  }

  @Test @WithMockUser(roles = "USER")
  void userCannotReadAdmin() throws Exception {
    mvc.perform(get("/admin/audit")).andExpect(status().isForbidden());
  }

  @Test @WithMockUser(roles = "ADMIN")
  void newUnlistedPathIsDenied() throws Exception {
    mvc.perform(get("/future-route")).andExpect(status().isForbidden());
  }
}` },
  ],
  "Sessão, JWT e CSRF": [
    { lang: "java", purpose: "Teste controlado prova a distinção: POST sem token é 403, com token chega ao handler.", code: `package br.dev.quiron.security;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@WebMvcTest(CsrfBoundaryTest.Probe.class)
@Import(CsrfBoundaryTest.Policy.class)
class CsrfBoundaryTest {
  @Autowired MockMvc mvc;
  @RestController static class Probe { @PostMapping("/csrf-probe") void accept() { } }
  @Configuration static class Policy {
    @Bean SecurityFilterChain chain(HttpSecurity http) throws Exception {
      return http.authorizeHttpRequests(a -> a.anyRequest().authenticated()).build();
    }
  }

  @Test @WithMockUser
  void unsafeMethodNeedsToken() throws Exception {
    mvc.perform(post("/csrf-probe")).andExpect(status().isForbidden());
    mvc.perform(post("/csrf-probe").with(csrf())).andExpect(status().isOk());
  }
}` },
    { lang: "java", purpose: "Resource Server rejeita issuer ou audience divergentes mesmo com assinatura válida.", code: `package br.dev.quiron.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2TokenValidator;
import org.springframework.security.oauth2.core.OAuth2TokenValidatorResult;
import org.springframework.security.oauth2.jwt.DelegatingOAuth2TokenValidator;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtValidators;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

@Configuration(proxyBeanMethods = false)
class JwtTrustConfiguration {
  @Bean
  JwtDecoder jwtDecoder(@Value("\${quiron.auth.jwks-uri}") String jwks,
      @Value("\${quiron.auth.issuer}") String issuer,
      @Value("\${quiron.auth.audience}") String audience) {
    var decoder = NimbusJwtDecoder.withJwkSetUri(jwks).build();
    OAuth2TokenValidator<Jwt> audienceCheck = jwt -> jwt.getAudience().contains(audience)
      ? OAuth2TokenValidatorResult.success()
      : OAuth2TokenValidatorResult.failure(new OAuth2Error("invalid_token", "audience mismatch", null));
    decoder.setJwtValidator(new DelegatingOAuth2TokenValidator<>(
      JwtValidators.createDefaultWithIssuer(issuer), audienceCheck));
    return decoder;
  }
}` },
  ],
  "Autorização de tenant e método": [
    { lang: "java", purpose: "Method security exige tenant do principal e consulta sempre escopada.", code: `package br.dev.quiron.security;

import java.util.Optional;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

@Configuration @EnableMethodSecurity
class MethodSecurityConfiguration { }

@Component("tenantPolicy")
class TenantPolicy {
  public boolean canRead(Authentication auth, String tenant) {
    return auth != null && auth.isAuthenticated() && auth.getName().equals(tenant);
  }
}

interface ReservationReader { Optional<String> find(String tenant, String reservationId); }

@Service
public class TenantReservationReader {
  private final ReservationReader reader;
  public TenantReservationReader(ReservationReader reader) { this.reader = reader; }

  @PreAuthorize("@tenantPolicy.canRead(authentication, #tenant)")
  public Optional<String> find(String tenant, String id) {
    return reader.find(tenant, id);
  }
}` },
    { lang: "java", purpose: "Teste da policy com identidade válida e forjada; o adapter ainda precisa de teste SQL com predicate.", code: `package br.dev.quiron.security;

import static org.junit.jupiter.api.Assertions.*;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

class TenantPolicyTest {
  private final TenantPolicy policy = new TenantPolicy();

  @Test void tenantMustComeFromAuthenticatedIdentity() {
    var identity = new UsernamePasswordAuthenticationToken("tenant-a", "n/a",
      List.of(new SimpleGrantedAuthority("ROLE_USER")));
    assertTrue(policy.canRead(identity, "tenant-a"));
    assertFalse(policy.canRead(identity, "tenant-b"));
    assertFalse(policy.canRead(null, "tenant-a"));
  }
}` },
  ],
  "CORS, headers e segredo": [
    { lang: "java", purpose: "CORS permite apenas frontend HTTPS conhecido e é integrado antes da autorização.", code: `package br.dev.quiron.security;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration(proxyBeanMethods = false)
class BrowserOriginPolicy {
  @Bean CorsConfigurationSource corsConfigurationSource() {
    var cors = new CorsConfiguration();
    cors.setAllowedOrigins(List.of("https://app.quiron.example"));
    cors.setAllowedMethods(List.of("GET", "POST"));
    cors.setAllowedHeaders(List.of("Content-Type", "Authorization", "Idempotency-Key", "X-CSRF-TOKEN"));
    cors.setAllowCredentials(true);
    var source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/v1/**", cors);
    return source;
  }

  @Bean SecurityFilterChain api(HttpSecurity http) throws Exception {
    http.cors(Customizer.withDefaults())
      .authorizeHttpRequests(a -> a.anyRequest().authenticated());
    return http.build();
  }
}` },
    { lang: "java", purpose: "Preflight de origem permitida passa; origem hostil não recebe autorização CORS.", code: `package br.dev.quiron.security;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class CorsPolicyTest {
  @Autowired MockMvc mvc;

  @Test void preflightOnlyTrustsConfiguredOrigin() throws Exception {
    mvc.perform(options("/v1/reservations")
        .header("Origin", "https://app.quiron.example")
        .header("Access-Control-Request-Method", "POST"))
      .andExpect(status().isOk())
      .andExpect(header().string("Access-Control-Allow-Origin", "https://app.quiron.example"));
    mvc.perform(options("/v1/reservations")
        .header("Origin", "https://attacker.example")
        .header("Access-Control-Request-Method", "POST"))
      .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
  }
}` },
  ],
  "HTTP clients e timeout": [
    { lang: "java", purpose: "Client imperativo usa builder do Boot, mesma chave e resultado desconhecido após falha de transporte.", code: `package br.dev.quiron.integration;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.ResourceAccessException;

record ChargeRequest(String reservationId) { }
record ChargeReceipt(String chargeId, String status) { }

@Component
public final class PaymentGateway {
  private final RestClient client;
  public PaymentGateway(RestClient.Builder builder, PaymentProperties properties) {
    this.client = builder.baseUrl(properties.baseUrl()).build();
  }

  public ChargeReceipt charge(String requestKey, String reservationId) {
    try {
      ChargeReceipt receipt = client.post().uri("/charges")
        .header("Idempotency-Key", requestKey)
        .body(new ChargeRequest(reservationId))
        .retrieve().body(ChargeReceipt.class);
      if (receipt == null) throw new IllegalStateException("empty provider response");
      return receipt;
    } catch (ResourceAccessException network) {
      throw new UnknownPaymentOutcome(requestKey, network);
    } catch (RestClientResponseException response) {
      if (response.getStatusCode().is5xxServerError())
        throw new UnknownPaymentOutcome(requestKey, response);
      throw response;
    }
  }
}

record PaymentProperties(String baseUrl) { }
class UnknownPaymentOutcome extends RuntimeException {
  UnknownPaymentOutcome(String key, Throwable cause) { super("Reconcile payment by key " + key, cause); }
}` },
    { lang: "yaml", purpose: "Timeouts de conexão/leitura e redirects limitados na linha atual do Boot; configuração é validada no startup.", code: `spring:
  http:
    clients:
      connect-timeout: 1s
      read-timeout: 2s
      redirects: dont-follow
quiron:
  provider:
    base-url: https://payments.example` },
  ],
  "Eventos de aplicação e outbox": [
    { lang: "java", purpose: "Reserva e evento são gravados no mesmo boundary transacional.", code: `package br.dev.quiron.data;

import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReserveAndEnqueue {
  private final JdbcClient jdbc;
  public ReserveAndEnqueue(JdbcClient jdbc) { this.jdbc = jdbc; }

  @Transactional
  public void reserve(String tenant, String key, String id, String fingerprint) {
    jdbc.sql("insert into request_key(tenant_id, request_key, fingerprint, reservation_id) values (?, ?, ?, ?)")
      .params(tenant, key, fingerprint, id).update();
    jdbc.sql("insert into reservation(id, tenant_id, status) values (?, ?, ?)")
      .params(id, tenant, "confirmed").update();
    jdbc.sql("insert into outbox(event_id, tenant_id, reservation_id, state, version) values (?, ?, ?, 'pending', 0)")
      .params(key, tenant, id).update();
  }
}` },
    { lang: "sql", purpose: "Claim PostgreSQL com SKIP LOCKED e fencing; conclusão antiga não pode sobrescrever novo dono.", code: `-- Em transação curta, claim de até 10 eventos elegíveis:
with picked as (
  select event_id from outbox
  where (state = 'pending' or (state = 'in_flight' and lease_until < now()))
    and next_attempt_at <= now()
  order by event_id
  limit 10
  for update skip locked
)
update outbox o
set state = 'in_flight', version = o.version + 1,
    lease_until = now() + interval '30 seconds'
from picked p
where o.event_id = p.event_id
returning o.event_id, o.version, o.tenant_id, o.reservation_id;

-- Após publicar com a mesma Idempotency-Key:
update outbox
set state = 'done', lease_until = null
where event_id = :event_id and version = :claimed_version and state = 'in_flight';
-- Exigir affected rows = 1; se 0, worker perdeu o lease.` },
  ],
  "Jobs, scheduling e ownership": [
    { lang: "java", purpose: "Scheduler apenas dispara polling; claim e conclusão por versão dão ownership a uma réplica por vez.", code: `package br.dev.quiron.jobs;

import java.time.Duration;
import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

record ClaimedEvent(String id, long version, String tenant) { }

@Component
public final class OutboxPoller {
  private final JdbcClient jdbc;
  private final TransactionTemplate tx;
  private final EventSender sender;
  public OutboxPoller(JdbcClient jdbc, TransactionTemplate tx, EventSender sender) {
    this.jdbc = jdbc; this.tx = tx; this.sender = sender;
  }

  @Scheduled(fixedDelayString = "PT5S")
  public void poll() {
    List<ClaimedEvent> claimed = tx.execute(status -> jdbc.sql("""
        with picked as (
          select event_id from outbox
          where (state = 'pending' or (state = 'in_flight' and lease_until < now()))
            and next_attempt_at <= now()
          order by event_id limit 10 for update skip locked
        )
        update outbox o set state = 'in_flight', version = o.version + 1,
          lease_until = now() + interval '30 seconds'
        from picked p where o.event_id = p.event_id
        returning o.event_id, o.version, o.tenant_id
        """).query((rs, row) -> new ClaimedEvent(
          rs.getString("event_id"), rs.getLong("version"), rs.getString("tenant_id"))).list());
    if (claimed == null) return;
    for (ClaimedEvent event : claimed) {
      sender.send(event.id(), event.tenant()); // mesma chave no destino
      int changed = jdbc.sql("""
          update outbox set state = 'done', lease_until = null
          where event_id = ? and version = ? and state = 'in_flight'
          """).params(event.id(), event.version()).update();
      if (changed != 1) throw new IllegalStateException("lease perdido: " + event.id());
    }
  }
}

interface EventSender { void send(String eventId, String tenant); }` },
    { lang: "sql", purpose: "Janela diária reivindicada por chave única e atualização cercada por fencing, adequada a réplicas concorrentes.", code: `create table job_window (
  job_name text not null,
  period_date date not null,
  status text not null check (status in ('pending', 'running', 'done')),
  lease_until timestamptz,
  version bigint not null default 0,
  primary key (job_name, period_date)
);

-- Materializar todos os dias atrasados; ON CONFLICT preserva progresso.
insert into job_window(job_name, period_date, status)
select 'daily-close', d::date, 'pending'
from generate_series(:first_day::date, :last_day::date, interval '1 day') d
on conflict (job_name, period_date) do nothing;

-- Reivindicar um período em transação curta.
with picked as (
  select job_name, period_date from job_window
  where job_name = 'daily-close'
    and (status = 'pending' or (status = 'running' and lease_until < now()))
  order by period_date limit 1 for update skip locked
)
update job_window j
set status = 'running', version = j.version + 1,
    lease_until = now() + interval '2 minutes'
from picked p
where j.job_name = p.job_name and j.period_date = p.period_date
returning j.period_date, j.version;

-- Ao concluir, exigir affected rows = 1; versão antiga não pode finalizar.
update job_window set status = 'done', lease_until = null
where job_name = 'daily-close' and period_date = :period
  and version = :claimed_version and status = 'running';` },
  ],
  "Resiliência, retry e circuit breaker": [
    { lang: "java", purpose: "Política explícita preserva idempotency key e deadline; resultado de transporte ambíguo vira reconciliação.", code: `package br.dev.quiron.integration;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.Semaphore;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientResponseException;

@Component
public final class BoundedCharge {
  private final PaymentGateway gateway;
  private final Clock clock;
  private final Semaphore slots = new Semaphore(8);
  public BoundedCharge(PaymentGateway gateway, Clock clock) {
    this.gateway = gateway; this.clock = clock;
  }

  public ChargeReceipt send(String key, String reservationId, Instant deadline) {
    if (!slots.tryAcquire()) throw new UpstreamBusyException();
    try {
      for (int attempt = 1; attempt <= 2; attempt++) {
        if (Duration.between(clock.instant(), deadline).toMillis() < 300)
          throw new UnknownPaymentOutcome(key, new IllegalStateException("deadline"));
        try {
          return gateway.charge(key, reservationId); // chave estável em todas tentativas
        } catch (UnknownPaymentOutcome ambiguous) {
          // Não repetimos efeito ambíguo sem consulta de status por chave.
          throw ambiguous;
        } catch (RestClientResponseException response) {
          if (response.getStatusCode().value() != 429 || attempt == 2) throw response;
          // Um backoff com jitter e remaining budget deve preceder a próxima tentativa.
        }
      }
      throw new IllegalStateException("unreachable");
    } finally { slots.release(); }
  }
}

class UpstreamBusyException extends RuntimeException { }` },
    { lang: "yaml", purpose: "Contrato de operação: limites por destino são propriedades da aplicação, não retry automático do Boot.", code: `quiron:
  payment:
    base-url: https://payments.example
    max-in-flight: 8
    queue-capacity: 0
    total-deadline: 3s
    connect-timeout: 500ms
    read-timeout: 1s
    max-attempts: 2
    retry-statuses: [429]
    reconcile-ambiguous-outcome: true
    circuit-breaker:
      minimum-calls: 20
      failure-rate-threshold: 50
      open-duration: 10s
      half-open-probes: 2
# Estes nomes são configuração do adapter Quíron; sem binding e teste,
# 503/timeout são resultado ambíguo até consulta por chave ao provedor.
# Este YAML não altera o comportamento do RestClient por si só.` },
  ],
  "JUnit, testes de domínio e fakes": [
    { lang: "java", purpose: "Núcleo Java sem contexto Spring: Clock fixo, chave composta e conflito de fingerprint são observáveis.", code: `package br.dev.quiron.domain;

import java.time.Clock;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

record RequestKey(String tenant, String key) { }
record Reservation(String id, String tenant, String fingerprint, Instant createdAt) { }
interface ReservationPort {
  Reservation find(RequestKey key);
  void save(RequestKey key, Reservation reservation);
}

final class ReserveSeat {
  private final ReservationPort port;
  private final Clock clock;
  ReserveSeat(ReservationPort port, Clock clock) { this.port = port; this.clock = clock; }
  Reservation execute(String tenant, String key, String fingerprint, String id) {
    RequestKey request = new RequestKey(tenant, key);
    Reservation old = port.find(request);
    if (old != null) {
      if (!Objects.equals(old.fingerprint(), fingerprint)) throw new IllegalStateException("409 fingerprint");
      return old;
    }
    Reservation next = new Reservation(id, tenant, fingerprint, clock.instant());
    port.save(request, next);
    return next;
  }
}

final class FakeReservationPort implements ReservationPort {
  private final Map<RequestKey, Reservation> rows = new HashMap<>();
  public Reservation find(RequestKey key) { return rows.get(key); }
  public void save(RequestKey key, Reservation value) {
    if (rows.putIfAbsent(key, value) != null) throw new IllegalStateException("duplicate key");
  }
  int size() { return rows.size(); }
}` },
    { lang: "java", purpose: "JUnit prova replay sem novo efeito, conflito de fingerprint e isolamento por tenant no fake.", code: `package br.dev.quiron.domain;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ReserveSeatTest {
  private final FakeReservationPort rows = new FakeReservationPort();
  private final ReserveSeat useCase = new ReserveSeat(rows,
    Clock.fixed(Instant.parse("2026-01-02T03:04:05Z"), ZoneOffset.UTC));

  @Test void sameKeyAndFingerprintReplaysTheSameReservation() {
    Reservation first = useCase.execute("a", "key-1", "hash-1", "r-1");
    Reservation replay = useCase.execute("a", "key-1", "hash-1", "r-2");
    assertEquals(first, replay);
    assertEquals(1, rows.size());
    assertEquals(Instant.parse("2026-01-02T03:04:05Z"), first.createdAt());
  }

  @Test void divergentFingerprintIsConflictWithoutNewWrite() {
    useCase.execute("a", "key-1", "hash-1", "r-1");
    assertThrows(IllegalStateException.class,
      () -> useCase.execute("a", "key-1", "hash-2", "r-2"));
    assertEquals(1, rows.size());
  }

  @Test void sameKeyInAnotherTenantIsIndependent() {
    useCase.execute("a", "key-1", "hash-1", "r-1");
    useCase.execute("b", "key-1", "hash-1", "r-2");
    assertEquals(2, rows.size());
  }
}` },
  ],
  "Slices MVC, JSON e segurança": [
    { lang: "java", purpose: "Slice MVC isola binding/JSON; filtro de segurança é testado separadamente no segundo exemplo.", code: `package br.dev.quiron.web;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ReservationController.class)
@AutoConfigureMockMvc(addFilters = false) // APENAS contrato MVC; segurança no próximo exemplo
class ReservationControllerSliceTest {
  @Autowired MockMvc mvc;
  @MockitoBean ReserveReservation reserve;

  @Test void invalidPayloadNeverReachesUseCase() throws Exception {
    mvc.perform(post("/v1/reservations").contentType(MediaType.APPLICATION_JSON)
        .content("{\\\"seatId\\\":\\\"\\\"}"))
      .andExpect(status().isBadRequest());
    verifyNoInteractions(reserve);
  }

  @Test void acceptedCommandHasPublicRepresentation() throws Exception {
    when(reserve.execute(any())).thenReturn(new ReservationView("r-7", "confirmed"));
    mvc.perform(post("/v1/reservations").contentType(MediaType.APPLICATION_JSON)
        .content("{\\\"seatId\\\":\\\"a-1\\\"}"))
      .andExpect(status().isCreated())
      .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
      .andExpect(jsonPath("$.reservationId").value("r-7"))
      .andExpect(jsonPath("$.status").value("confirmed"));
  }
}

record CreateReservation(@NotBlank String seatId) { }
record ReservationView(String reservationId, String status) { }
interface ReserveReservation { ReservationView execute(CreateReservation command); }

@RestController
class ReservationController {
  private final ReserveReservation reserve;
  ReservationController(ReserveReservation reserve) { this.reserve = reserve; }
  @PostMapping("/v1/reservations")
  ResponseEntity<ReservationView> create(@Valid @RequestBody CreateReservation request) {
    return ResponseEntity.status(201).body(reserve.execute(request));
  }
}` },
    { lang: "java", purpose: "Slice com chain explícita: sessão autenticada ainda precisa de CSRF para POST.", code: `package br.dev.quiron.web;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.ResponseEntity;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(ReservationController.class)
@Import(SessionSecurity.class)
class ReservationSecuritySliceTest {
  @Autowired MockMvc mvc;
  @MockitoBean ReserveReservation reserve;

  @Test void authenticatedSessionStillNeedsCsrfForMutation() throws Exception {
    mvc.perform(post("/v1/reservations").with(user("alice").roles("CUSTOMER"))
        .contentType("application/json").content("{\\\"seatId\\\":\\\"a-1\\\"}"))
      .andExpect(status().isForbidden());
  }

  @Test void acceptedCsrfPassesSecurityBoundary() throws Exception {
    when(reserve.execute(any())).thenReturn(new ReservationView("r-7", "confirmed"));
    mvc.perform(post("/v1/reservations").with(user("alice").roles("CUSTOMER"))
        .with(csrf()).contentType("application/json")
        .content("{\\\"seatId\\\":\\\"a-1\\\"}"))
      .andExpect(status().isCreated());
  }
}

record CreateReservation(String seatId) { }
record ReservationView(String reservationId, String status) { }
interface ReserveReservation { ReservationView execute(CreateReservation command); }

@RestController
class ReservationController {
  private final ReserveReservation reserve;
  ReservationController(ReserveReservation reserve) { this.reserve = reserve; }
  @PostMapping("/v1/reservations")
  ResponseEntity<ReservationView> create(@RequestBody CreateReservation request) {
    return ResponseEntity.status(201).body(reserve.execute(request));
  }
}

@Configuration(proxyBeanMethods = false)
class SessionSecurity {
  @Bean SecurityFilterChain chain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(auth -> auth
      .requestMatchers("/v1/reservations").hasRole("CUSTOMER")
      .anyRequest().denyAll());
    http.httpBasic(Customizer.withDefaults());
    return http.build(); // CSRF permanece no default
  }
}` },
  ],
  "@SpringBootTest e contexto real": [
    { lang: "java", purpose: "Contexto real valida beans críticos e, em porta aleatória, request atravessa servidor e transação próprios.", code: `package br.dev.quiron.integration;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.ApplicationContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClient;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
  properties = {"quiron.provider.base-url=http://127.0.0.1:9999", "management.health.probes.enabled=true"})
class ProductionWiringTest {
  @Autowired ApplicationContext context;
  @LocalServerPort int port;

  @Test void criticalAdaptersArePresent() {
    assertNotNull(context.getBean(ReservationService.class));
    assertNotNull(context.getBean(ReservationRepository.class));
  }

  @Test void healthCrossesRealSocket() {
    RestClient client = RestClient.builder().baseUrl("http://127.0.0.1:" + port).build();
    ResponseEntity<String> response = client.get().uri("/actuator/health/readiness")
      .retrieve().toEntity(String.class);
    assertEquals(200, response.getStatusCode().value());
  }
}` },
    { lang: "yaml", purpose: "Profile de teste representativo falha cedo sem properties necessárias; não aponta para serviço do usuário.", code: `# application-test.yml; valores externos são apenas fakes locais de teste.
spring:
  profiles:
    active: test
  datasource:
    url: jdbc:postgresql://127.0.0.1:54399/quiron_test
    username: quiron_test
    password: local-only
quiron:
  provider:
    base-url: http://127.0.0.1:9999
    connect-timeout: 300ms
    read-timeout: 500ms
# Um smoke test que só inicia contexto precisa de banco de teste existente;
# não use este arquivo contra produção nem trate sua existência como prova de integração.` },
  ],
  "Banco real, fixtures e contratos": [
    { lang: "java", purpose: "Gate opcional em PostgreSQL descartável: service connection fornece URL e migrations reais ao contexto.", code: `package br.dev.quiron.data;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import static org.junit.jupiter.api.Assertions.assertEquals;

@Testcontainers
@SpringBootTest
class ReservationDatabaseTest {
  @Container @ServiceConnection
  static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:17.6");
  @Autowired JdbcClient jdbc;

  @Test void migrationCreatedTenantScopedUniqueKey() {
    jdbc.sql("insert into request_key(tenant_id, request_key, fingerprint, reservation_id) values (?, ?, ?, ?)")
      .params("a", "key-1", "hash-1", "r-1").update();
    jdbc.sql("insert into request_key(tenant_id, request_key, fingerprint, reservation_id) values (?, ?, ?, ?)")
      .params("b", "key-1", "hash-1", "r-2").update();
    Long count = jdbc.sql("select count(*) from request_key where request_key = ?")
      .param("key-1").query(Long.class).single();
    assertEquals(2L, count);
  }
}` },
    { lang: "sql", purpose: "Contrato PostgreSQL demonstrável: chave composta aceita tenants diferentes e recusa duplicata no mesmo tenant.", code: `create table request_key (
  tenant_id text not null,
  request_key text not null,
  fingerprint text not null,
  reservation_id text not null,
  primary key (tenant_id, request_key)
);

insert into request_key values ('a', 'same', 'hash-1', 'r-1');
insert into request_key values ('b', 'same', 'hash-1', 'r-2');

-- Deve afetar 0 linhas: replay idêntico, sem sobrescrever fingerprint.
insert into request_key values ('a', 'same', 'hash-1', 'r-3')
on conflict (tenant_id, request_key) do nothing;

-- A aplicação compara fingerprint e retorna a reserva original r-1.
select fingerprint, reservation_id from request_key
where tenant_id = 'a' and request_key = 'same';

-- O teste de concorrência deve usar DUAS conexões independentes e barreira;
-- esta sequência isolada comprova constraint, não interleaving.` },
  ],
  "Health, readiness e liveness": [
    { lang: "java", purpose: "HealthIndicator de backlog é diagnóstico separado: não o inclua automaticamente em liveness.", code: `package br.dev.quiron.ops;

import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Component;

@Component("outboxBacklog")
public final class OutboxBacklogHealth implements HealthIndicator {
  private final JdbcClient jdbc;
  public OutboxBacklogHealth(JdbcClient jdbc) { this.jdbc = jdbc; }

  @Override public Health health() {
    Long oldestSeconds = jdbc.sql("""
      select coalesce(extract(epoch from now() - min(created_at))::bigint, 0)
      from outbox where state = 'pending'
      """).query(Long.class).single();
    if (oldestSeconds != null && oldestSeconds > 300)
      return Health.down().withDetail("reason", "outbox-lag").build();
    return Health.up().build();
  }
}` },
    { lang: "yaml", purpose: "Probes expostas minimamente; liveness permanece local e backlog é grupo interno de diagnóstico.", code: `management:
  endpoint:
    health:
      probes:
        enabled: true
      show-details: never
      group:
        liveness:
          include: livenessState
        readiness:
          include: readinessState
        operations:
          include: outboxBacklog,db
  endpoints:
    web:
      exposure:
        include: health,info
# /actuator/health/operations ainda precisa de controle de acesso;
# não exponha endpoint de diagnóstico detalhado por engano.` },
  ],
  "Métricas Micrometer e cardinalidade": [
    { lang: "java", purpose: "Tags enumeradas e timer de ponta a ponta; IDs não entram em séries.", code: `package br.dev.quiron.ops;

import io.micrometer.core.instrument.Counter;
import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.Timer;
import java.util.Set;
import java.util.function.Supplier;
import org.springframework.stereotype.Component;

@Component
public final class ReservationMetrics {
  private static final Set<String> OUTCOMES = Set.of("accepted", "conflict", "unavailable");
  private final MeterRegistry registry;
  public ReservationMetrics(MeterRegistry registry) { this.registry = registry; }

  public <T> T time(String operation, Supplier<T> work) {
    if (!Set.of("create", "cancel").contains(operation)) throw new IllegalArgumentException("operation");
    return Timer.builder("quiron.reservation.duration")
      .tag("operation", operation).register(registry).record(work);
  }

  public void outcome(String operation, String outcome) {
    if (!Set.of("create", "cancel").contains(operation) || !OUTCOMES.contains(outcome))
      throw new IllegalArgumentException("unbounded metric tag");
    Counter.builder("quiron.reservation.outcome")
      .tags("operation", operation, "outcome", outcome).register(registry).increment();
  }
}` },
    { lang: "java", purpose: "Teste de cardinalidade: mil request IDs não criam mil meters porque IDs nunca viram tags.", code: `package br.dev.quiron.ops;

import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class ReservationMetricsTest {
  @Test void dimensionsStayBoundedWhenRequestsGrow() {
    try (SimpleMeterRegistry registry = new SimpleMeterRegistry()) {
      ReservationMetrics metrics = new ReservationMetrics(registry);
      for (int i = 0; i < 1000; i++) {
        String requestId = "req-" + i; // nunca usado como tag
        metrics.time("create", () -> requestId.length());
        metrics.outcome("create", i % 2 == 0 ? "accepted" : "conflict");
      }
      assertEquals(3, registry.getMeters().size()); // 1 timer + 2 counters
      assertEquals(500.0, registry.get("quiron.reservation.outcome")
        .tag("outcome", "accepted").counter().count());
      assertThrows(IllegalArgumentException.class,
        () -> metrics.outcome("create", "req-unique"));
    }
  }
}` },
  ],
  "Tracing, logs e redaction": [
    { lang: "java", purpose: "Filtro normaliza correlation id e limpa MDC em finally para evitar vazamento entre requests.", code: `package br.dev.quiron.ops;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;
import org.slf4j.MDC;
import org.springframework.web.filter.OncePerRequestFilter;

public final class CorrelationFilter extends OncePerRequestFilter {
  @Override protected void doFilterInternal(HttpServletRequest request,
      HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
    String incoming = request.getHeader("X-Correlation-Id");
    String id = incoming != null && incoming.matches("[a-zA-Z0-9_-]{1,64}")
      ? incoming : UUID.randomUUID().toString();
    try {
      MDC.put("correlationId", id);
      response.setHeader("X-Correlation-Id", id);
      chain.doFilter(request, response);
    } finally { MDC.remove("correlationId"); }
  }
}` },
    { lang: "java", purpose: "Client usa builder instrumentado do Boot e não envia bearer token nem baggage de usuário ao destino.", code: `package br.dev.quiron.ops;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public final class TracedProviderClient {
  private final RestClient client;
  public TracedProviderClient(RestClient.Builder bootBuilder, ProviderSettings settings) {
    this.client = bootBuilder.baseUrl(settings.baseUrl()).build();
  }

  public ProviderState lookup(String correlationId, String stableKey) {
    return client.get().uri("/charges/by-key/{key}", stableKey)
      .header("X-Correlation-Id", correlationId)
      .retrieve().body(ProviderState.class);
  }
}

record ProviderSettings(String baseUrl) { }
record ProviderState(String status, String remoteId) { }` },
  ],
  "Diagnóstico de contexto e JVM": [
    { lang: "java", purpose: "Teste de condição de contexto identifica bean efetivo sem imprimir connection string ou senha.", code: `package br.dev.quiron.ops;

import javax.sql.DataSource;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionEvaluationReport;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ConfigurableApplicationContext;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ContextDiagnosisTest {
  @Autowired ConfigurableApplicationContext context;

  @Test void oneDatasourceAndConditionReportExist() {
    assertEquals(1, context.getBeansOfType(DataSource.class).size());
    ConditionEvaluationReport report = ConditionEvaluationReport.get(context.getBeanFactory());
    assertFalse(report.getConditionAndOutcomesBySource().isEmpty());
    // Não registrar DataSource.toString(), env nem report integral em CI público.
  }
}` },
    { lang: "yaml", purpose: "Exposição de diagnóstico restrita; métricas úteis sem heapdump/env abertos na Web.", code: `management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: when-authorized
  metrics:
    tags:
      application: quiron-api
# Proteja rede e autenticação da porta de gerenciamento.
# JFR/heap dump devem ser coletados com procedimento operacional,
# armazenados com acesso restrito e prazo de retenção.` },
  ],
  "Servlet threads e virtual threads": [
    { lang: "yaml", purpose: "Ativa virtual threads Java 21+ sem retirar limites de conexões e da operação remota.", code: `spring:
  threads:
    virtual:
      enabled: true
  datasource:
    hikari:
      maximum-pool-size: 10
      connection-timeout: 500ms
server:
  tomcat:
    max-connections: 200
quiron:
  provider:
    max-in-flight: 8
    total-deadline: 3s
# Compare p99, throughput, Hikari pending e RSS com o modo anterior.
# Virtual threads não aumentam o banco nem a quota do provedor.` },
    { lang: "java", purpose: "Admission limit explícito contém pressão mesmo quando cada tarefa usa thread virtual barata.", code: `package br.dev.quiron.ops;

import java.util.concurrent.Semaphore;
import org.springframework.stereotype.Component;

@Component
public final class PaymentAdmission {
  private final Semaphore slots = new Semaphore(8, true);

  public <T> T execute(CheckedSupplier<T> work) throws Exception {
    if (!slots.tryAcquire()) throw new CapacityExceededException();
    try { return work.get(); }
    finally { slots.release(); }
  }
}

@FunctionalInterface interface CheckedSupplier<T> { T get() throws Exception; }
class CapacityExceededException extends RuntimeException { }` },
  ],
  "Pool, cache e backpressure": [
    { lang: "yaml", purpose: "Pool e cache Caffeine são bounded; provider Caffeine requer dependência de runtime e @EnableCaching.", code: `spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      minimum-idle: 2
      connection-timeout: 500ms
      max-lifetime: 30m
  cache:
    type: caffeine
    cache-names: seatCatalog
    caffeine:
      spec: maximumSize=10000,expireAfterWrite=60s
quiron:
  admission:
    reserve-max-in-flight: 20
    outbox-claim-batch: 10
# Nunca use cache de catálogo como árbitro único da última vaga.` },
    { lang: "java", purpose: "Chave de cache inclui tenant e consulta apenas catálogo de leitura; transação de reserva usa banco.", code: `package br.dev.quiron.catalog;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;

record SeatView(String seatId, String label) { }

@Service
public class SeatCatalog {
  private final JdbcClient jdbc;
  public SeatCatalog(JdbcClient jdbc) { this.jdbc = jdbc; }

  @Cacheable(cacheNames = "seatCatalog", key = "#tenant + ':' + #seatId")
  public SeatView find(String tenant, String seatId) {
    return jdbc.sql("""
      select seat_id, label from seat_catalog
      where tenant_id = ? and seat_id = ?
      """).params(tenant, seatId)
      .query((rs, row) -> new SeatView(rs.getString(1), rs.getString(2))).optional()
      .orElseThrow(() -> new IllegalArgumentException("seat not found"));
  }
}` },
  ],
  "Queries, N+1 e profiling": [
    { lang: "sql", purpose: "Query paginada com predicate de tenant e índice composto; EXPLAIN compara plano em dados representativos.", code: `create index if not exists reservation_tenant_created_id_idx
  on reservation (tenant_id, created_at desc, id desc);

explain (analyze, buffers)
select id, status, created_at
from reservation
where tenant_id = 'tenant-fixture'
  and (created_at, id) < (timestamp with time zone '2026-01-01 00:00:00+00', 'r-900')
order by created_at desc, id desc
limit 50;

-- Use dados e parâmetros de teste representativos.
-- EXPLAIN ANALYZE executa a consulta; não use sem cautela em DML.` },
    { lang: "java", purpose: "Projeção DTO evita serializar entidade JPA/lazy relations e restringe tenant no SQL.", code: `package br.dev.quiron.read;

import java.time.Instant;
import java.util.List;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

record ReservationRow(String id, String status, Instant createdAt) { }

@Repository
public class ReservationReadModel {
  private final JdbcClient jdbc;
  public ReservationReadModel(JdbcClient jdbc) { this.jdbc = jdbc; }

  public List<ReservationRow> page(String tenant, Instant before, String beforeId) {
    return jdbc.sql("""
      select id, status, created_at from reservation
      where tenant_id = :tenant and (created_at, id) < (:before, :beforeId)
      order by created_at desc, id desc limit 50
      """)
      .param("tenant", tenant).param("before", before).param("beforeId", beforeId)
      .query((rs, row) -> new ReservationRow(
        rs.getString("id"), rs.getString("status"),
        rs.getTimestamp("created_at").toInstant())).list();
  }
}` },
  ],
  "Tuning e orçamento de memória": [
    { lang: "yaml", purpose: "Orçamento de execução por container; flags JVM são definidas no deploy, não pelo application.yml.", code: `# Exemplo de inventário operacional, NÃO propriedades automáticas do Spring.
quiron:
  resource-budget:
    container-memory: 768MiB
    target-xmx: 480MiB
    native-and-headroom: 288MiB
    max-upload: 8MiB
    max-concurrent-uploads: 8
    max-export-rows-per-page: 500
# No manifesto do container, aplique -Xmx480m e limite 768MiB.
# Valide RSS e p99 sob carga: os números acima são hipótese inicial.` },
    { lang: "java", purpose: "Cópia de upload em stream com teto de bytes evita materializar MultipartFile inteiro em heap.", code: `package br.dev.quiron.files;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public final class BoundedUploadStore {
  private static final long MAX_BYTES = 8L * 1024 * 1024;
  private final Path root;
  public BoundedUploadStore(UploadSettings settings) { this.root = settings.root(); }

  public Path save(MultipartFile upload) throws IOException {
    if (upload.getSize() > MAX_BYTES) throw new IllegalArgumentException("too large");
    Path path = Files.createTempFile(root, "incoming-", ".bin");
    boolean completed = false;
    try (InputStream in = upload.getInputStream(); OutputStream out = Files.newOutputStream(path)) {
      byte[] buffer = new byte[8192];
      long total = 0;
      for (int n; (n = in.read(buffer)) >= 0; ) {
        total += n;
        if (total > MAX_BYTES) throw new IllegalArgumentException("too large");
        out.write(buffer, 0, n);
      }
      completed = true;
      return path;
    } finally { if (!completed) Files.deleteIfExists(path); }
  }
}

record UploadSettings(Path root) { }` },
  ],
  "Executable jar, layers e imagem": [
    { lang: "xml", purpose: "POM Boot 4.1.1 com starter MVC atual e plugin de JAR executável.", code: `<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>
  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>4.1.1</version><relativePath/>
  </parent>
  <groupId>br.dev.quiron</groupId><artifactId>quiron-api</artifactId><version>1.0.0</version>
  <properties><java.version>21</java.version></properties>
  <dependencies>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-webmvc</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-validation</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-jdbc</artifactId></dependency>
    <dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-actuator</artifactId></dependency>
  </dependencies>
  <build><plugins><plugin>
    <groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId>
  </plugin></plugins></build>
</project>` },
    { lang: "yaml", purpose: "Pipeline ilustrativo preserva o mesmo JAR para teste e imagem em executor com Maven/Java.", code: `name: quiron-release-gate
on: [push]
jobs:
  package-and-smoke:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: '21'
      - name: Test and package
        run: ./mvnw -B verify
      - name: Record artifact hash
        run: sha256sum target/quiron-api-1.0.0.jar
# Este workflow pressupõe mvnw versionado e ambiente de teste descartável.
# Imagem OCI/secret scan são gates separados antes da publicação.` },
  ],
  "Profiles e config de produção": [
    { lang: "java", purpose: "Binding tipado reprova URL insegura e deadlines incoerentes no startup.", code: `package br.dev.quiron.config;

import java.net.URI;
import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "quiron.provider")
public record ProviderProperties(URI baseUrl, Duration connectTimeout,
    Duration readTimeout, Duration totalDeadline, int maxInFlight) {
  public ProviderProperties {
    if (baseUrl == null || !"https".equalsIgnoreCase(baseUrl.getScheme()))
      throw new IllegalArgumentException("provider URL must use HTTPS");
    if (connectTimeout == null || readTimeout == null || totalDeadline == null
        || connectTimeout.isNegative() || connectTimeout.isZero()
        || readTimeout.isNegative() || readTimeout.isZero()
        || totalDeadline.compareTo(connectTimeout.plus(readTimeout)) < 0
        || maxInFlight < 1)
      throw new IllegalArgumentException("invalid provider budget");
  }
}` },
    { lang: "yaml", purpose: "Config de produção sem fallback de segredo ou URL; valores obrigatórios chegam de ambiente controlado.", code: `spring:
  config:
    activate:
      on-profile: prod
  datasource:
    url: \${QUIRON_DB_URL}
    username: \${QUIRON_DB_USER}
    password: \${QUIRON_DB_PASSWORD}
quiron:
  provider:
    base-url: \${QUIRON_PROVIDER_HTTPS_URL}
    connect-timeout: 500ms
    read-timeout: 1s
    total-deadline: 3s
    max-in-flight: 8
# Nenhum placeholder usa default secreto; ausência deve abortar startup.
# Nunca logue os valores resolvidos nem exponha /actuator/env.` },
  ],
  "Migrations e rollout compatível": [
    { lang: "sql", purpose: "Expand PostgreSQL preserva app antiga; backfill em lotes e constraint só após verificação.", code: `-- Release N+1: expand. A aplicação N continua usando status.
alter table reservation add column state text;
-- CONCURRENTLY precisa rodar fora de bloco transacional; a ferramenta de
-- migration deve suportar essa etapa não transacional explicitamente.
create index concurrently if not exists reservation_state_idx
  on reservation (tenant_id, state);

-- Worker de backfill com checkpoint; repetir em transações pequenas:
with batch as (
  select id from reservation where state is null
  order by id limit 500 for update skip locked
)
update reservation r set state = r.status
from batch b where r.id = b.id;

-- Depois que N+1 dual-write e o backfill acabarem:
select count(*) as rows_not_migrated from reservation where state is null;
-- Só em release posterior, fora da janela com pods N:
-- alter table reservation alter column state set not null;
-- drop column status exige ainda outra revisão de compatibilidade.` },
    { lang: "yaml", purpose: "Matriz de rollout é contrato de release, não configuração automática do Boot.", code: `release-gate:
  schema: expanded-v2
  binaries-tested:
    - previous: 1.0.0
    - candidate: 1.1.0
  fixtures:
    - old-reservations-with-null-state
    - pending-outbox-v1
    - duplicate-request-key-race
  canary:
    minimum-observation: 15m
    checks: [http-error-rate, p95, hikari-pending, outbox-oldest-age]
  rollback:
    binary: 1.0.0
    keep-expanded-schema: true
    preserve: [request_key, reservation, outbox]
# Critérios precisam de thresholds numéricos definidos pelo SLO do serviço.` },
  ],
  "Shutdown, drain e rollback": [
    { lang: "yaml", purpose: "Prazo de graceful shutdown coerente com timeout de request/worker e janela do orquestrador.", code: `spring:
  lifecycle:
    timeout-per-shutdown-phase: 20s
server:
  shutdown: graceful
quiron:
  provider:
    total-deadline: 3s
  outbox:
    lease-duration: 30s
    poll-batch: 10
# Orquestrador: terminationGracePeriodSeconds deve exceder drain + 20s.
# SIGKILL continua possível: a outbox e a idempotência dão recuperação.` },
    { lang: "java", purpose: "Worker interrompe novos claims no fechamento; eventos em andamento continuam duráveis para replay.", code: `package br.dev.quiron.jobs;

import java.util.concurrent.atomic.AtomicBoolean;
import org.springframework.context.SmartLifecycle;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public final class DrainAwarePoller implements SmartLifecycle {
  private final AtomicBoolean running = new AtomicBoolean(false);
  private final OutboxDispatcher dispatcher;
  public DrainAwarePoller(OutboxDispatcher dispatcher) { this.dispatcher = dispatcher; }

  @Override public void start() { running.set(true); }
  @Override public boolean isRunning() { return running.get(); }
  @Override public void stop() { running.set(false); }

  @Scheduled(fixedDelayString = "PT5S")
  public void tick() {
    if (running.get()) dispatcher.claimAndDispatchBoundedBatch();
  }
}

interface OutboxDispatcher { void claimAndDispatchBoundedBatch(); }` },
  ],
  "Auto-config customizada e starters": [
    { lang: "java", purpose: "Auto-config só cria client quando habilitada e recua diante de implementação própria.", code: `package br.dev.quiron.starter;

import org.springframework.boot.autoconfigure.AutoConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnClass;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestClient;

@AutoConfiguration
@ConditionalOnClass(RestClient.class)
@ConditionalOnProperty(prefix = "quiron.payments", name = "enabled", havingValue = "true")
public class QuironPaymentsAutoConfiguration {
  @Bean
  @ConditionalOnMissingBean(PaymentPort.class)
  PaymentPort paymentPort(RestClient.Builder builder, PaymentStarterProperties properties) {
    RestClient client = builder.baseUrl(properties.baseUrl()).build();
    return key -> client.get().uri("/charges/by-key/{key}", key)
      .retrieve().body(String.class);
  }
}

interface PaymentPort { String status(String key); }
record PaymentStarterProperties(String baseUrl) { }

// No JAR: META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports
// br.dev.quiron.starter.QuironPaymentsAutoConfiguration` },
    { lang: "java", purpose: "ContextRunner prova ausência por default e presença quando property habilita a extensão.", code: `package br.dev.quiron.starter;

import org.junit.jupiter.api.Test;
import org.springframework.boot.autoconfigure.AutoConfigurations;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;
import static org.assertj.core.api.Assertions.assertThat;

class PaymentsAutoConfigurationTest {
  private final ApplicationContextRunner runner = new ApplicationContextRunner()
    .withConfiguration(AutoConfigurations.of(QuironPaymentsAutoConfiguration.class))
    .withUserConfiguration(Fixture.class);

  @Test void disabledByDefault() {
    runner.run(ctx -> assertThat(ctx).doesNotHaveBean(PaymentPort.class));
  }

  @Test void enabledByExplicitProperty() {
    runner.withPropertyValues("quiron.payments.enabled=true")
      .run(ctx -> assertThat(ctx).hasSingleBean(PaymentPort.class));
  }

  @Configuration(proxyBeanMethods = false)
  static class Fixture {
    @Bean RestClient.Builder builder() { return RestClient.builder(); }
    @Bean PaymentStarterProperties properties() {
      return new PaymentStarterProperties("https://payments.example");
    }
  }
}` },
  ],
  "Supply chain, SBOM e patching": [
    { lang: "xml", purpose: "Plugin CycloneDX gera inventário de dependências no build; associe SBOM ao hash do JAR/imagem.", code: `<plugin>
  <groupId>org.cyclonedx</groupId>
  <artifactId>cyclonedx-maven-plugin</artifactId>
  <!-- Fixe versão aprovada pela organização após checar changelog. -->
  <version>2.9.3</version>
  <executions><execution>
    <phase>verify</phase>
    <goals><goal>makeAggregateBom</goal></goals>
  </execution></executions>
</plugin>
<!-- Este fragmento vai dentro de build/plugins do POM.
     Gere também inventário da imagem/base, não só do JAR. -->` },
    { lang: "yaml", purpose: "Checklist de release liga origem, digest, inventário e patch policy; não é configuração automática do Boot.", code: `artifact-attestation:
  commit: required
  java-toolchain: '21'
  jar-sha256: required
  image-digest: required
  base-image-digest: required
  sbom:
    format: CycloneDX
    scope: [application-jar, runtime-image]
  vulnerability-policy:
    critical: block-or-approved-expiring-exception
    high: review-with-owner-and-deadline
  secrets:
    sentinel-scan: [logs, jar, image-layers, sbom]
  deploy:
    must-use-tested-digest: true
# Executar estes checks no CI; este YAML é especificação do gate.` },
  ],
  "Native image e AOT": [
    { lang: "java", purpose: "RuntimeHint registra apenas DTO refletido e recurso específico para o binário nativo.", code: `package br.dev.quiron.nativeimage;

import org.springframework.aot.hint.MemberCategory;
import org.springframework.aot.hint.RuntimeHints;
import org.springframework.aot.hint.RuntimeHintsRegistrar;
import org.springframework.context.annotation.ImportRuntimeHints;
import org.springframework.context.annotation.Configuration;

@Configuration(proxyBeanMethods = false)
@ImportRuntimeHints(OutboxHints.class)
class NativeOutboxConfiguration { }

final class OutboxHints implements RuntimeHintsRegistrar {
  @Override public void registerHints(RuntimeHints hints, ClassLoader classLoader) {
    hints.reflection().registerType(LegacyOutboxEvent.class,
      MemberCategory.INVOKE_DECLARED_CONSTRUCTORS,
      MemberCategory.ACCESS_DECLARED_FIELDS);
    hints.resources().registerPattern("schemas/outbox-v1.json");
  }
}

record LegacyOutboxEvent(String id, String tenant, String kind) { }` },
    { lang: "xml", purpose: "Perfil Maven separado aciona processamento AOT/native em executor preparado; teste do binário é gate adicional.", code: `<profile>
  <id>native</id>
  <build><plugins>
    <plugin>
      <groupId>org.graalvm.buildtools</groupId>
      <artifactId>native-maven-plugin</artifactId>
    </plugin>
    <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
      <executions><execution><goals><goal>process-aot</goal></goals></execution></executions>
    </plugin>
  </plugins></build>
</profile>
<!-- Integrar ao POM com versões geridas/aprovadas; testar o binário nativo
     em ambiente descartável antes de promover release. -->` },
  ],
  "Incidentes, limites e recovery": [
    { lang: "sql", purpose: "Consulta de reconciliação somente leitura localiza unknown e leases vencidos sem efeito externo.", code: `-- Consultar em réplica/ambiente autorizado, com parâmetros e limite.
select k.tenant_id, k.request_key, k.fingerprint,
       k.reservation_id, r.payment_status
from request_key k join reservation r
  on r.id = k.reservation_id and r.tenant_id = k.tenant_id
where r.payment_status = 'unknown'
  and k.created_at < now() - interval '2 minutes'
order by k.created_at limit 100;

select event_id, tenant_id, reservation_id, state, version, lease_until
from outbox
where state = 'pending'
   or (state = 'in_flight' and lease_until < now())
order by event_id limit 100;

-- Não atualizar para done por SQL manual sem consultar destino por chave.
-- No restore, confirmar schema, contagens e chaves antes de ligar worker.` },
    { lang: "yaml", purpose: "Runbook especifica oráculos e ações seguras antes de retomar operações; não é config do Spring.", code: `incident: payment-unknown-and-outbox-lag
detect:
  - outbox_oldest_age_seconds > 300
  - payment_unknown_count > 0
contain:
  - pause_new_non_idempotent_payment_attempts
  - preserve_request_key_and_outbox
diagnose:
  - compare_local_key_with_provider_status_by_same_key
  - check_hikari_pending_and_provider_timeouts
recover:
  - replay_pending_with_original_event_id
  - reconcile_unknown_without_new_key
  - verify_cross_tenant_zero_and_no_duplicate_charge
release:
  - record_rpo_rto_from_restore_drill
  - unblock_only_after_business_oracles_pass
# Antes de produção, converter em procedimento com owner e thresholds reais.` },
  ],
  "Módulos e contratos do serviço": [
    { lang: "sql", purpose: "Schema mínimo PostgreSQL: tenant, última vaga, idempotência e outbox ficam duráveis e consultáveis.", code: `create table seat_inventory (
  tenant_id text not null,
  session_id text not null,
  remaining integer not null check (remaining >= 0),
  primary key (tenant_id, session_id)
);
create table request_key (
  tenant_id text not null,
  request_key text not null,
  fingerprint text not null,
  reservation_id text not null,
  created_at timestamptz not null default now(),
  primary key (tenant_id, request_key)
);
create table reservation (
  id text primary key,
  tenant_id text not null,
  session_id text not null,
  status text not null check (status in ('pending', 'confirmed', 'cancelled')),
  payment_status text not null default 'pending'
    check (payment_status in ('pending', 'unknown', 'confirmed', 'failed')),
  created_at timestamptz not null default now()
);
create index reservation_tenant_created_id_idx
  on reservation (tenant_id, created_at desc, id desc);
create table outbox (
  event_id text primary key,
  tenant_id text not null,
  reservation_id text not null references reservation(id),
  payload_version integer not null default 1,
  state text not null check (state in ('pending', 'in_flight', 'done', 'dead')),
  version bigint not null default 0,
  lease_until timestamptz,
  next_attempt_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index outbox_claim_idx on outbox (state, next_attempt_at, event_id);` },
    { lang: "java", purpose: "Contrato de domínio não importa Spring; identidade já validada e fingerprint canônico entram explicitamente.", code: `package br.dev.quiron.domain;

import java.time.Instant;
import java.util.Objects;

public record ReserveCommand(String tenant, String requestKey,
    String sessionId, String fingerprint, Instant requestedAt) {
  public ReserveCommand {
    Objects.requireNonNull(tenant);
    Objects.requireNonNull(requestKey);
    Objects.requireNonNull(sessionId);
    Objects.requireNonNull(fingerprint);
    Objects.requireNonNull(requestedAt);
    if (tenant.isBlank() || requestKey.isBlank() || sessionId.isBlank())
      throw new IllegalArgumentException("missing reservation identity");
  }
}

record ReserveResult(String reservationId, boolean replayed, String status) { }

interface ReservationCommandPort {
  ReserveResult reserve(ReserveCommand command);
}

// O tenant vem da credencial validada no adapter HTTP, nunca do JSON.` },
  ],
  "Reserva transacional e idempotência": [
    { lang: "java", purpose: "Boundary público: unique key, capacidade, reserva e outbox comitam juntos; replay relê resultado original.", code: `package br.dev.quiron.data;

import java.util.UUID;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

record ReserveResult(String reservationId, boolean replayed, String status) { }

@Service
public class ReserveTransaction {
  private final JdbcClient jdbc;
  public ReserveTransaction(JdbcClient jdbc) { this.jdbc = jdbc; }

  @Transactional
  public ReserveResult reserve(String tenant, String key, String sessionId, String fingerprint) {
    String id = UUID.randomUUID().toString();
    int inserted = jdbc.sql("""
      insert into request_key(tenant_id, request_key, fingerprint, reservation_id)
      values (?, ?, ?, ?) on conflict (tenant_id, request_key) do nothing
      """).params(tenant, key, fingerprint, id).update();
    if (inserted == 0) {
      var old = jdbc.sql("""
        select fingerprint, reservation_id from request_key
        where tenant_id = ? and request_key = ?
        """).params(tenant, key)
        .query((rs, row) -> new String[]{rs.getString(1), rs.getString(2)}).single();
      if (!old[0].equals(fingerprint)) throw new IdempotencyConflict();
      String status = jdbc.sql("select status from reservation where id = ? and tenant_id = ?")
        .params(old[1], tenant).query(String.class).single();
      return new ReserveResult(old[1], true, status);
    }
    int allocated = jdbc.sql("""
      update seat_inventory set remaining = remaining - 1
      where tenant_id = ? and session_id = ? and remaining > 0
      """).params(tenant, sessionId).update();
    if (allocated != 1) throw new SoldOut(); // RuntimeException => rollback da key
    jdbc.sql("insert into reservation(id, tenant_id, session_id, status) values (?, ?, ?, 'pending')")
      .params(id, tenant, sessionId).update();
    jdbc.sql("insert into outbox(event_id, tenant_id, reservation_id, state) values (?, ?, ?, 'pending')")
      .params(id + "-created", tenant, id).update();
    return new ReserveResult(id, false, "pending");
  }
}

class IdempotencyConflict extends RuntimeException { }
class SoldOut extends RuntimeException { }` },
    { lang: "sql", purpose: "Oráculos SQL para corrida com capacidade 1 e replay; duas conexões devem competir no teste.", code: `insert into seat_inventory(tenant_id, session_id, remaining)
values ('tenant-a', 'session-1', 1);

-- Após duas chamadas concorrentes para chaves diferentes:
select remaining from seat_inventory
where tenant_id = 'tenant-a' and session_id = 'session-1';
-- Esperado: 0; exatamente uma reserva pending e uma recusa SoldOut.
select count(*) from reservation
where tenant_id = 'tenant-a' and session_id = 'session-1';
-- Esperado: 1.
select count(*) from outbox where tenant_id = 'tenant-a';
-- Esperado: 1.

-- Após replay da chave vencedora, os três resultados não mudam.
-- Após mesma chave com fingerprint diferente, 409 e estado não muda.
-- Os SELECTs são oráculos; o teste precisa de duas transações/conexões
-- e barreira para provar o interleaving.` },
  ],
  "Segurança, carga e observabilidade": [
    { lang: "java", purpose: "SecurityFilterChain com default deny e autorização explícita da API; ownership continua no banco.", code: `package br.dev.quiron.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration(proxyBeanMethods = false)
public class ApiSecurity {
  @Bean SecurityFilterChain apiChain(HttpSecurity http) throws Exception {
    http.authorizeHttpRequests(auth -> auth
      .requestMatchers("/actuator/health/liveness", "/actuator/health/readiness").permitAll()
      .requestMatchers(HttpMethod.GET, "/v1/reservations/**").hasAuthority("SCOPE_reservations:read")
      .requestMatchers(HttpMethod.POST, "/v1/reservations").hasAuthority("SCOPE_reservations:write")
      .anyRequest().denyAll());
    http.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwt -> { }));
    // Bearer-only stateless API: revisar CSRF se cookies/sessão forem adicionados.
    http.csrf(csrf -> csrf.disable());
    return http.build();
  }
}` },
    { lang: "yaml", purpose: "Sinais e limites de carga são configurados sem IDs de usuário como tags.", code: `spring:
  datasource:
    hikari:
      maximum-pool-size: 10
      connection-timeout: 500ms
management:
  endpoint:
    health:
      probes:
        enabled: true
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
quiron:
  admission:
    reserve-max-in-flight: 20
    provider-max-in-flight: 8
    outbox-claim-batch: 8
  alerts:
    outbox-oldest-pending: 5m
# Proteja /actuator/metrics e /actuator/prometheus na rede e na chain.
# As propriedades quiron.* exigem binding e implementação próprios.` },
  ],
  "Banca, deploy e restore": [
    { lang: "yaml", purpose: "Checklist final torna explícitos ambientes, oráculos, mutantes e gates externos ainda não executados.", code: `release-candidate: quiron-api-1.0.0
artifacts:
  jar-sha256: required
  image-digest: required
  sbom: required
gates:
  domain-junit: required
  mvc-security-slice: required
  context-boot: required
  postgres-migration-and-race: required
  provider-timeout-after-effect: required
  two-worker-lease-fencing: required
  load-and-cardinality: required
  image-startup-and-sigterm: required
  restore-with-request-key-and-outbox: required
mutants-that-must-fail:
  - remove-tenant-predicate
  - remove-unique-request-key
  - remove-transaction
  - remove-outbox
  - remove-claim-version
report:
  executed: []
  pending: []
  evidence-links: []
# Não marque gate required como aprovado por checagem de sintaxe Java.` },
    { lang: "sql", purpose: "Validação read-only pós-restore: invariantes essenciais antes de ligar worker/provedor fake.", code: `-- Em banco restaurado ISOLADO; registrar contagens e divergências.
select count(*) as reservations from reservation;
select count(*) as request_keys from request_key;
select count(*) as pending_events from outbox where state = 'pending';
select count(*) as ambiguous_leases from outbox
where state = 'in_flight' and lease_until < now();

-- Deve retornar zero: chave aponta para reserva ausente ou outro tenant.
select count(*) as orphaned_keys
from request_key k left join reservation r
  on r.id = k.reservation_id and r.tenant_id = k.tenant_id
where r.id is null;

-- Deve retornar zero: evento aponta para reserva ausente/outro tenant.
select count(*) as orphaned_events
from outbox o left join reservation r
  on r.id = o.reservation_id and r.tenant_id = o.tenant_id
where r.id is null;

-- Só depois destes checks e da configuração de provedor FAKE:
-- iniciar worker e comparar efeitos por event_id/chave estável.` },
  ],
};
