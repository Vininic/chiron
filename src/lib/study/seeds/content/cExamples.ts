export type CExample = { lang: "c"; code: string; purpose: string };

/** Dois exemplos específicos por seção; sem compiler gate, permanecem draft. */
export const C_EXAMPLES: Record<string, [CExample, CExample]> = {
  "Padrão, compilador e flags": [
    { lang: "c", purpose: "Programa C17 autocontido que falha se compilado em dialeto anterior; comando recomendado: cc -std=c17 -Wall -Wextra -Wpedantic -Werror.", code: `#include <stdio.h>
#include <stdlib.h>

#if !defined(__STDC_VERSION__) || __STDC_VERSION__ < 201710L
#error "Este exemplo exige C17 ou posterior"
#endif

int main(void) {
    printf("STDC_VERSION=%ld", (long)__STDC_VERSION__);
    putchar(10);
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Contagem e tamanho de alocação são validados antes de multiplicar ou converter signed para size_t.", code: `#include <limits.h>
#include <stdint.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

static int valid_bytes(long count, size_t item_size, size_t *out) {
    if (count <= 0 || item_size == 0) return 0;
    if ((uintmax_t)count > (uintmax_t)SIZE_MAX / item_size) return 0;
    *out = (size_t)count * item_size;
    return 1;
}

int main(void) {
    size_t bytes = 0;
    if (valid_bytes(-1, sizeof(int), &bytes)) return EXIT_FAILURE;
    if (!valid_bytes(3, sizeof(int), &bytes)) return EXIT_FAILURE;
    if (bytes != 3 * sizeof(int)) return EXIT_FAILURE;
    puts("CHECKED_ALLOCATION_SIZE_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Pré-processador, compilação e ligação": [
    { lang: "c", purpose: "static inline avalia argumento uma vez, ao contrário de macro SQUARE(i++).", code: `#include <stdio.h>
#include <stdlib.h>

static inline int square(int value) { return value * value; }

int main(void) {
    int i = 3;
    int result = square(i++);
    if (result != 9 || i != 4) return EXIT_FAILURE;
    puts("INLINE_SINGLE_EVALUATION_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Uso local de declaração extern e definição única; o gate multi-translation-unit fica pendente até haver compilador.", code: `#include <stdio.h>
#include <stdlib.h>

extern int reservation_count;
static int private_increment(void) { return ++reservation_count; }
int reservation_count = 0; /* definição única neste translation unit */

int main(void) {
    if (private_increment() != 1 || reservation_count != 1) return EXIT_FAILURE;
    puts("EXTERN_SINGLE_DEFINITION_LOCAL_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "main, argumentos e códigos de saída": [
    { lang: "c", purpose: "CLI completa valida argc e strtol/endptr/errno/range antes de emitir sucesso.", code: `#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char **argv) {
    if (argc != 3 || strlen(argv[1]) == 0 || strlen(argv[1]) > 16) {
        fputs("usage: reserve SEAT QUANTITY", stderr);
        fputc(10, stderr);
        return EXIT_FAILURE;
    }
    errno = 0;
    char *end = NULL;
    long quantity = strtol(argv[2], &end, 10);
    if (errno == ERANGE || end == argv[2] || *end != 0 ||
        quantity < 1 || quantity > INT_MAX) {
        fputs("invalid quantity", stderr);
        fputc(10, stderr);
        return EXIT_FAILURE;
    }
    printf("pending:%s:%ld", argv[1], quantity);
    putchar(10);
    if (fflush(stdout) == EOF) return EXIT_FAILURE;
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Erro em stderr retorna falha e nunca imprime recibo de sucesso; simula falha antes do commit.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int persist(const char *key) {
    return strcmp(key, "fail") == 0 ? -1 : 0;
}

int main(int argc, char **argv) {
    if (argc != 2 || argv[1][0] == 0) {
        fputs("invalid key", stderr);
        fputc(10, stderr);
        return EXIT_FAILURE;
    }
    if (persist(argv[1]) != 0) {
        fputs("persistence unavailable", stderr);
        fputc(10, stderr);
        return EXIT_FAILURE;
    }
    puts("pending:r1");
    return EXIT_SUCCESS;
}` },
  ],
  "Tipos básicos e limites": [
    { lang: "c", purpose: "SIZE_MAX/INT_MAX e sizeof são observados na implementação sem assumir largura de int/long.", code: `#include <limits.h>
#include <stdint.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    if (CHAR_BIT < 8 || sizeof(size_t) < sizeof(unsigned int))
        return EXIT_FAILURE; /* limite desta fixture, não regra universal de C */
    printf("INT_MAX=%d SIZE_MAX=%ju", INT_MAX, (uintmax_t)SIZE_MAX);
    putchar(10);
    puts("IMPLEMENTATION_LIMITS_RECORDED_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Preço em centavos inteiros usa checagem de soma antes do efeito e rejeita moeda divergente.", code: `#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct money { long cents; char currency[4]; };

static int add_money(struct money a, struct money b, struct money *out) {
    if (strcmp(a.currency, b.currency) != 0) return 0;
    if (a.cents < 0 || b.cents < 0 || a.cents > LONG_MAX - b.cents) return 0;
    out->cents = a.cents + b.cents;
    memcpy(out->currency, a.currency, sizeof(out->currency));
    return 1;
}

int main(void) {
    struct money ten = {10, "BRL"}, total = {0, ""};
    if (!add_money(ten, ten, &total) || total.cents != 20) return EXIT_FAILURE;
    if (add_money(ten, (struct money){1, "USD"}, &total)) return EXIT_FAILURE;
    if (add_money((struct money){LONG_MAX, "BRL"}, ten, &total)) return EXIT_FAILURE;
    puts("INTEGER_CENTS_CHECKED_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Expressões, precedência e efeitos": [
    { lang: "c", purpose: "Isola efeitos em statements sequenciados antes da chamada de reserva e verifica a ordem registrada.", code: `#include <stdio.h>
#include <stdlib.h>

static int trace[2];
static int used = 0;
static int key(void) { trace[used++] = 1; return 41; }
static int debit(void) { trace[used++] = 2; return 9; }
static int reserve(int k, int amount) { return k == 41 && amount == 9; }

int main(void) {
    int k = key();
    int amount = debit();
    if (!reserve(k, amount) || used != 2 || trace[0] != 1 || trace[1] != 2)
        return EXIT_FAILURE;
    puts("SEQUENCED_EFFECTS_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Curto-circuito impede chamada externa quando precondição falha; conversão signed ocorre somente após validação.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

static int calls = 0;
static int charge(void) { ++calls; return 1; }
static int allowed(int quantity, size_t capacity) {
    if (quantity <= 0) return 0;
    return (size_t)quantity <= capacity;
}

int main(void) {
    if (allowed(-1, 8) && charge()) return EXIT_FAILURE;
    if (calls != 0) return EXIT_FAILURE;
    if (!(allowed(2, 8) && charge()) || calls != 1) return EXIT_FAILURE;
    puts("SHORT_CIRCUIT_GUARD_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "if, switch e loops": [
    { lang: "c", purpose: "Switch rejeita status externo desconhecido e preserva estado; nenhuma categoria vira sucesso por default.", code: `#include <stdio.h>
#include <stdlib.h>

enum status { PENDING = 1, CONFIRMED = 2, SOLD_OUT = 3 };
static int classify(int wire, int *confirmed) {
    switch (wire) {
        case PENDING: *confirmed = 0; return 1;
        case CONFIRMED: *confirmed = 1; return 1;
        case SOLD_OUT: *confirmed = 0; return 1;
        default: return 0;
    }
}

int main(void) {
    int confirmed = 7;
    if (classify(99, &confirmed) || confirmed != 7) return EXIT_FAILURE;
    if (!classify(CONFIRMED, &confirmed) || confirmed != 1) return EXIT_FAILURE;
    puts("UNKNOWN_STATUS_REJECTED_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Laço bounded detecta EOF prematuro e tamanho inválido sem aceitar frame parcial.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

static int read_frame(const unsigned char *src, size_t available,
                      unsigned char *dst, size_t capacity, size_t expected) {
    if (expected > capacity || expected > available || (!src && expected) ||
        (!dst && expected)) return 0;
    for (size_t i = 0; i < expected; ++i) dst[i] = src[i];
    return 1;
}

int main(void) {
    const unsigned char input[2] = {4, 5};
    unsigned char out[3] = {9, 9, 9};
    if (read_frame(input, 2, out, 3, 3) || out[0] != 9)
        return EXIT_FAILURE;
    if (!read_frame(input, 2, out, 3, 2) || out[0] != 4 || out[1] != 5)
        return EXIT_FAILURE;
    puts("FRAME_LENGTH_GUARD_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Funções, parâmetros e retorno": [
    { lang: "c", purpose: "API por slice emprestado valida comprimento e mantém out intacto em falhas.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

enum result { RES_OK, RES_INVALID, RES_SOLD_OUT };
static enum result reserve(const unsigned char *key, size_t len,
                           int quantity, int capacity, int *out) {
    if (!key || !out || len == 0 || len > 16 || quantity <= 0)
        return RES_INVALID;
    if (quantity > capacity) return RES_SOLD_OUT;
    *out = capacity - quantity;
    return RES_OK;
}

int main(void) {
    const unsigned char key[2] = {'a', 'b'}; /* sem NUL, slice válido */
    int remaining = 7;
    if (reserve(key, 2, -1, 4, &remaining) != RES_INVALID || remaining != 7)
        return EXIT_FAILURE;
    if (reserve(key, 2, 5, 4, &remaining) != RES_SOLD_OUT || remaining != 7)
        return EXIT_FAILURE;
    if (reserve(key, 2, 1, 4, &remaining) != RES_OK || remaining != 3)
        return EXIT_FAILURE;
    puts("OUT_PARAMETER_ATOMIC_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Recibo é escrito em buffer do caller, nunca retornado como ponteiro para stack local.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int receipt(unsigned id, char *out, size_t capacity) {
    if (!out || capacity == 0) return 0;
    char temp[32];
    int n = snprintf(temp, sizeof temp, "reservation:%u", id);
    if (n < 0 || (size_t)n >= sizeof temp || (size_t)n >= capacity) return 0;
    memcpy(out, temp, (size_t)n + 1);
    return 1;
}

int main(void) {
    char a[32] = "unchanged", b[32] = "unchanged";
    if (receipt(41, a, 4) || strcmp(a, "unchanged") != 0)
        return EXIT_FAILURE;
    if (!receipt(41, a, sizeof a) || !receipt(42, b, sizeof b))
        return EXIT_FAILURE;
    if (strcmp(a, "reservation:41") || strcmp(b, "reservation:42"))
        return EXIT_FAILURE;
    puts("CALLER_OWNED_RECEIPT_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Enums, typedef e representação": [
    { lang: "c", purpose: "Decodificação de wire enum usa mapeamento explícito e rejeita código futuro sem alterar saída.", code: `#include <stdio.h>
#include <stdlib.h>

enum state { STATE_PENDING, STATE_CONFIRMED, STATE_SOLD_OUT };
static int decode(unsigned char wire, enum state *out) {
    if (!out) return 0;
    switch (wire) {
        case 1: *out = STATE_PENDING; return 1;
        case 2: *out = STATE_CONFIRMED; return 1;
        case 3: *out = STATE_SOLD_OUT; return 1;
        default: return 0;
    }
}

int main(void) {
    enum state state = STATE_SOLD_OUT;
    if (decode(99, &state) || state != STATE_SOLD_OUT)
        return EXIT_FAILURE;
    if (!decode(2, &state) || state != STATE_CONFIRMED)
        return EXIT_FAILURE;
    puts("WIRE_ENUM_VALIDATED_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Tagged union é construída por funções; tag desconhecida não expõe payload nem é serializada.", code: `#include <stdio.h>
#include <stdlib.h>

enum tag { TAG_OK = 1, TAG_ERROR = 2 };
struct outcome { enum tag tag; union { unsigned receipt; int error; } value; };
static struct outcome ok(unsigned receipt) {
    struct outcome result = {0};
    result.tag = TAG_OK;
    result.value.receipt = receipt;
    return result;
}
static int receipt_of(struct outcome result, unsigned *out) {
    if (!out || result.tag != TAG_OK) return 0;
    *out = result.value.receipt;
    return 1;
}

int main(void) {
    struct outcome result = ok(41);
    unsigned receipt = 0;
    if (!receipt_of(result, &receipt) || receipt != 41) return EXIT_FAILURE;
    result.tag = (enum tag)99;
    if (receipt_of(result, &receipt) || receipt != 41) return EXIT_FAILURE;
    puts("TAGGED_UNION_GUARD_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Ponteiros e lifetime": [
    { lang: "c", purpose: "Contexto adquire cópia de bytes temporários; alteração do buffer emprestado não muda chave retida.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct context { unsigned char key[16]; size_t length; };
static int remember(struct context *ctx, const unsigned char *key, size_t len) {
    if (!ctx || !key || len == 0 || len > sizeof ctx->key) return 0;
    memcpy(ctx->key, key, len);
    ctx->length = len;
    return 1;
}

int main(void) {
    unsigned char request[3] = {'a','b','c'};
    struct context ctx = {{0}, 0};
    if (!remember(&ctx, request, sizeof request)) return EXIT_FAILURE;
    request[0] = 'x';
    if (ctx.length != 3 || memcmp(ctx.key, "abc", 3) != 0) return EXIT_FAILURE;
    puts("BORROW_COPIED_BEFORE_RETURN_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Factory com T** publica saída apenas em sucesso; caller possui e libera o bloco adquirido.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int copy_key(const char *src, size_t len, char **out) {
    if (!out) return 0;
    *out = NULL;
    if (!src || len == 0 || len > 16) return 0;
    char *tmp = malloc(len + 1);
    if (!tmp) return 0;
    memcpy(tmp, src, len);
    tmp[len] = 0;
    *out = tmp;
    return 1;
}

int main(void) {
    char *owned = NULL;
    if (copy_key(NULL, 2, &owned) || owned != NULL) return EXIT_FAILURE;
    if (!copy_key("abc", 3, &owned) || strcmp(owned, "abc") != 0)
        return EXIT_FAILURE;
    free(owned);
    puts("OWNED_OUTPUT_LIFETIME_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Arrays, decaimento e limites": [
    { lang: "c", purpose: "Função recebe comprimento separado do ponteiro; cópia integral testa o erro clássico de sizeof(parameter).", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int copy_items(int *dst, size_t capacity, const int *src, size_t count) {
    if (!dst || !src || count > capacity || count > (size_t)-1 / sizeof *src)
        return 0;
    memcpy(dst, src, count * sizeof *src);
    return 1;
}

int main(void) {
    int src[5] = {11,22,33,44,55}, dst[5] = {0};
    if (!copy_items(dst, 5, src, 5) || memcmp(src, dst, sizeof src) != 0)
        return EXIT_FAILURE;
    if (copy_items(dst, 4, src, 5)) return EXIT_FAILURE;
    puts("ARRAY_LENGTH_EXPLICIT_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "memmove compacta array com overlap sem acessar fora de n; n=0 não faz underflow.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int pop_front(int *data, size_t *length) {
    if (!data || !length || *length == 0) return 0;
    if (*length > 1) memmove(data, data + 1, (*length - 1) * sizeof *data);
    --*length;
    return 1;
}

int main(void) {
    int items[4] = {10,20,30,99};
    size_t length = 3;
    if (!pop_front(items, &length) || length != 2 ||
        items[0] != 20 || items[1] != 30 || items[3] != 99)
        return EXIT_FAILURE;
    if (!pop_front(items, &length) || !pop_front(items, &length) ||
        pop_front(items, &length) || length != 0) return EXIT_FAILURE;
    puts("OVERLAP_AND_ZERO_BOUND_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Strings, NUL e UTF-8": [
    { lang: "c", purpose: "Validação de key usa comprimento do frame e rejeita NUL/byte fora do alfabeto antes de copiar.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int valid_key(const unsigned char *src, size_t len,
                     char out[17]) {
    if (!src || !out || len == 0 || len > 16) return 0;
    for (size_t i = 0; i < len; ++i) {
        unsigned char c = src[i];
        if (!((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') ||
              (c >= '0' && c <= '9') || c == '_' || c == '-')) return 0;
    }
    memcpy(out, src, len);
    out[len] = 0;
    return 1;
}

int main(void) {
    const unsigned char bad[3] = {'a',0,'b'};
    const unsigned char good[3] = {'a','_','b'};
    char out[17] = "unchanged";
    if (valid_key(bad, 3, out) || strcmp(out, "unchanged"))
        return EXIT_FAILURE;
    if (!valid_key(good, 3, out) || strcmp(out, "a_b"))
        return EXIT_FAILURE;
    puts("NUL_REJECTED_BY_LENGTH_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "memchr encontra delimitador dentro de slice binário, inclusive após NUL, sem depender de strlen.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int delimiter_at(const unsigned char *data, size_t len,
                        unsigned char delimiter, size_t *out) {
    if (!data || !out) return 0;
    const unsigned char *found = memchr(data, delimiter, len);
    if (!found) return 0;
    *out = (size_t)(found - data);
    return 1;
}

int main(void) {
    const unsigned char frame[5] = {'a',0,'b',':','c'};
    size_t at = 99;
    if (!delimiter_at(frame, sizeof frame, ':', &at) || at != 3)
        return EXIT_FAILURE;
    if (delimiter_at(frame, sizeof frame, 'x', &at) || at != 3)
        return EXIT_FAILURE;
    puts("BINARY_SLICE_PARSE_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "const, aliasing e restrict": [
    { lang: "c", purpose: "memmove define contrato com overlap, inclusive mesma origem/destino; não usa restrict indevidamente.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int shift_bytes(unsigned char *buffer, size_t length,
                       size_t capacity) {
    if (!buffer || length > capacity || length == capacity) return 0;
    memmove(buffer + 1, buffer, length);
    buffer[0] = '!';
    return 1;
}

int main(void) {
    unsigned char bytes[5] = {'a','b','c',0,99};
    if (!shift_bytes(bytes, 3, 4) || memcmp(bytes, "!abc", 4) != 0 ||
        bytes[4] != 99) return EXIT_FAILURE;
    if (shift_bytes(bytes, 5, 5)) return EXIT_FAILURE;
    puts("OVERLAP_CONTRACT_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Copia representação com memcpy para evitar type punning por cast; verifica tamanho/bytes do alvo.", code: `#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    float value = 1.0f;
    if (sizeof value != sizeof(uint32_t)) {
        puts("FLOAT_LAYOUT_UNSUPPORTED_ON_THIS_TARGET");
        return EXIT_SUCCESS;
    }
    uint32_t representation = 0;
    memcpy(&representation, &value, sizeof representation);
    float roundtrip = 0.0f;
    memcpy(&roundtrip, &representation, sizeof roundtrip);
    if (roundtrip != value) return EXIT_FAILURE;
    puts("REPRESENTATION_COPY_NO_ALIAS_CAST_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "malloc, calloc e free": [
    { lang: "c", purpose: "Verifica multiplicação contra SIZE_MAX antes da aquisição e garante erro sem out parcial.", code: `#include <stdint.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

static int allocate_ints(size_t count, int **out) {
    if (!out) return 0;
    *out = NULL;
    if (count == 0 || count > SIZE_MAX / sizeof(int) || count > 1024) return 0;
    int *tmp = calloc(count, sizeof *tmp);
    if (!tmp) return 0;
    *out = tmp;
    return 1;
}

int main(void) {
    int *items = NULL;
    if (allocate_ints(SIZE_MAX, &items) || items != NULL) return EXIT_FAILURE;
    if (!allocate_ints(3, &items) || items[0] != 0 || items[2] != 0)
        return EXIT_FAILURE;
    free(items);
    puts("CHECKED_ALLOC_AND_FREE_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Construtor com falha simulada não publica objeto nem vaza recursos adquiridos.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct message { char *key; char *body; };
static int make_message(const char *key, const char *body,
                        int fail_second, struct message **out) {
    if (!out || !key || !body) return 0;
    *out = NULL;
    struct message *tmp = calloc(1, sizeof *tmp);
    if (!tmp) return 0;
    size_t n = strlen(key) + 1;
    tmp->key = malloc(n);
    if (!tmp->key) { free(tmp); return 0; }
    memcpy(tmp->key, key, n);
    if (fail_second) { free(tmp->key); free(tmp); return 0; }
    n = strlen(body) + 1;
    tmp->body = malloc(n);
    if (!tmp->body) { free(tmp->key); free(tmp); return 0; }
    memcpy(tmp->body, body, n);
    *out = tmp;
    return 1;
}

int main(void) {
    struct message *msg = NULL;
    if (make_message("k1", "event", 1, &msg) || msg != NULL) return EXIT_FAILURE;
    if (!make_message("k1", "event", 0, &msg) || strcmp(msg->body, "event"))
        return EXIT_FAILURE;
    free(msg->body); free(msg->key); free(msg);
    puts("PARTIAL_CONSTRUCTION_CLEANUP_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "realloc e crescimento": [
    { lang: "c", purpose: "realloc usa temporário, checked doubling e metadados só mudam depois do sucesso.", code: `#include <stdint.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

struct vector { int *data; size_t length, capacity; };
static int push(struct vector *v, int value) {
    if (!v || v->length > v->capacity) return 0;
    if (v->length == v->capacity) {
        if (v->capacity > 1024 / 2) return 0;
        size_t next = v->capacity ? v->capacity * 2 : 2;
        if (next > SIZE_MAX / sizeof *v->data) return 0;
        int *tmp = realloc(v->data, next * sizeof *v->data);
        if (!tmp) return 0;
        v->data = tmp;
        v->capacity = next;
    }
    v->data[v->length++] = value;
    return 1;
}

int main(void) {
    struct vector v = {0};
    for (int i = 0; i < 20; ++i) if (!push(&v, i)) return EXIT_FAILURE;
    if (v.length != 20 || v.data[0] != 0 || v.data[19] != 19)
        return EXIT_FAILURE;
    free(v.data);
    puts("REALLOC_TRANSACTIONAL_GROWTH_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Falha determinística de crescimento preserva ponteiro, comprimento e bytes antigos.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

struct vector { int *data; size_t length, capacity; };
static int grow(struct vector *v, size_t requested, int inject_failure) {
    if (!v || requested > 1024) return 0;
    if (requested <= v->capacity) return 1;
    if (inject_failure) return 0; /* seam de teste antes do realloc */
    int *tmp = realloc(v->data, requested * sizeof *tmp);
    if (!tmp) return 0;
    v->data = tmp; v->capacity = requested;
    return 1;
}

int main(void) {
    struct vector v = {0};
    if (!grow(&v, 2, 0)) return EXIT_FAILURE;
    v.data[0] = 41; v.length = 1;
    int *original = v.data;
    if (grow(&v, 8, 1) || v.data != original ||
        v.capacity != 2 || v.length != 1 || v.data[0] != 41)
        return EXIT_FAILURE;
    free(v.data);
    puts("GROWTH_FAILURE_PRESERVES_STATE_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Ownership, borrow e cleanup": [
    { lang: "c", purpose: "Objeto parcialmente construído usa cleanup comum e entrega owner ao caller somente no sucesso.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct payload { char *key; char *body; };
static void destroy(struct payload *p) {
    if (!p) return;
    free(p->body); free(p->key); free(p);
}
static int build(const char *key, int fail_after_key, struct payload **out) {
    struct payload *tmp = NULL;
    if (!out || !key) return 0;
    *out = NULL;
    tmp = calloc(1, sizeof *tmp);
    if (!tmp) goto fail;
    tmp->key = malloc(strlen(key) + 1);
    if (!tmp->key) goto fail;
    strcpy(tmp->key, key); /* tamanho alocado por strlen validado nesta fixture */
    if (fail_after_key) goto fail;
    tmp->body = malloc(6);
    if (!tmp->body) goto fail;
    memcpy(tmp->body, "event", 6);
    *out = tmp;
    return 1;
fail:
    destroy(tmp);
    return 0;
}

int main(void) {
    struct payload *owned = NULL;
    if (build("k1", 1, &owned) || owned) return EXIT_FAILURE;
    if (!build("k1", 0, &owned) || strcmp(owned->body, "event"))
        return EXIT_FAILURE;
    destroy(owned);
    puts("SINGLE_OWNER_CLEANUP_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Enqueue transfere ownership somente no sucesso; falha deixa ponteiro com caller.", code: `#include <stdio.h>
#include <stdlib.h>

struct queue { int *item; };
static int enqueue(struct queue *q, int **owned) {
    if (!q || !owned || !*owned || q->item) return 0;
    q->item = *owned;
    *owned = NULL;
    return 1;
}

int main(void) {
    struct queue q = {0};
    int *caller = malloc(sizeof *caller);
    if (!caller) return EXIT_FAILURE;
    *caller = 41;
    int occupied = 7;
    q.item = &occupied; /* fila ocupada; não é transferida nem liberada */
    if (enqueue(&q, &caller) || !caller || *caller != 41)
        return EXIT_FAILURE;
    q.item = NULL;
    if (!enqueue(&q, &caller) || caller || !q.item || *q.item != 41)
        return EXIT_FAILURE;
    free(q.item);
    puts("OWNERSHIP_MOVES_ONLY_ON_SUCCESS_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Structs, layout e cópia": [
    { lang: "c", purpose: "Clone de struct com ponteiro faz deep copy e permanece válido após destruir origem.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct reservation { unsigned id; char *key; };
static void destroy(struct reservation *r) { free(r->key); r->key = NULL; }
static int clone(const struct reservation *src, struct reservation *out) {
    if (!src || !src->key || !out) return 0;
    size_t n = strlen(src->key) + 1;
    char *copy = malloc(n);
    if (!copy) return 0;
    memcpy(copy, src->key, n);
    out->id = src->id;
    out->key = copy;
    return 1;
}

int main(void) {
    struct reservation a = {41, NULL}, b = {0, NULL};
    a.key = malloc(3);
    if (!a.key) return EXIT_FAILURE;
    memcpy(a.key, "k1", 3);
    if (!clone(&a, &b)) return EXIT_FAILURE;
    destroy(&a);
    if (b.id != 41 || strcmp(b.key, "k1")) return EXIT_FAILURE;
    destroy(&b);
    puts("STRUCT_DEEP_CLONE_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Flexible array member calcula header+payload com guarda e mantém comprimento explícito.", code: `#include <stdint.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct frame { size_t length; unsigned char bytes[]; };
static struct frame *make_frame(const unsigned char *src, size_t len) {
    if ((!src && len) || len > 1024 || len > SIZE_MAX - sizeof(struct frame))
        return NULL;
    struct frame *f = malloc(sizeof *f + len);
    if (!f) return NULL;
    f->length = len;
    if (len) memcpy(f->bytes, src, len);
    return f;
}

int main(void) {
    const unsigned char payload[3] = {'a',0,'b'};
    struct frame *f = make_frame(payload, sizeof payload);
    if (!f || f->length != 3 || memcmp(f->bytes, payload, 3))
        return EXIT_FAILURE;
    free(f);
    puts("FLEXIBLE_ARRAY_LENGTH_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "stdio e erros": [
    { lang: "c", purpose: "Leitura usa fread em unidades de byte e distingue frame exato de EOF truncado.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int read_exact(FILE *in, unsigned char *out, size_t expected) {
    size_t used = 0;
    while (used < expected) {
        size_t n = fread(out + used, 1, expected - used, in);
        if (n) { used += n; continue; }
        if (ferror(in) || feof(in)) return 0;
        return 0; /* sem progresso: nunca gira para sempre */
    }
    return 1;
}

int main(void) {
    FILE *f = tmpfile();
    if (!f) return EXIT_FAILURE;
    const unsigned char data[3] = {'a',0,'b'};
    unsigned char out[4] = {0};
    if (fwrite(data, 1, 3, f) != 3 || fflush(f) || fseek(f, 0, SEEK_SET))
        return EXIT_FAILURE;
    if (!read_exact(f, out, 3) || memcmp(out, data, 3)) return EXIT_FAILURE;
    if (read_exact(f, out + 3, 1) || !feof(f)) return EXIT_FAILURE;
    if (fclose(f)) return EXIT_FAILURE;
    puts("FREAD_EOF_DISTINCT_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Escrita de bytes confere fwrite, fflush, fclose e readback; não alega durabilidade física.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int write_exact(FILE *out, const unsigned char *data, size_t len) {
    size_t used = 0;
    while (used < len) {
        size_t n = fwrite(data + used, 1, len - used, out);
        if (!n) return 0;
        used += n;
    }
    return fflush(out) == 0;
}

int main(void) {
    FILE *f = tmpfile();
    if (!f) return EXIT_FAILURE;
    const unsigned char payload[4] = {0,10,13,255};
    unsigned char readback[4] = {0};
    if (!write_exact(f, payload, sizeof payload) || fseek(f, 0, SEEK_SET) ||
        fread(readback, 1, 4, f) != 4 || memcmp(payload, readback, 4))
        return EXIT_FAILURE;
    if (fclose(f)) return EXIT_FAILURE;
    puts("STDIO_READBACK_NOT_FSYNC_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Caminhos, atomicidade e temporários": [
    { lang: "c", purpose: "Nome de objeto é ID ASCII opaco validado; exemplo não usa input como path nem promete resolver symlink.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int safe_id(const unsigned char *src, size_t len, char out[17]) {
    if (!src || !out || len == 0 || len > 16) return 0;
    for (size_t i = 0; i < len; ++i) {
        unsigned char c = src[i];
        if (!((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '-'))
            return 0;
    }
    memcpy(out, src, len); out[len] = 0;
    return 1;
}

int main(void) {
    const unsigned char traversal[] = {'a','.','.','/','b'};
    char id[17] = "unchanged";
    if (safe_id(traversal, sizeof traversal, id) || strcmp(id, "unchanged"))
        return EXIT_FAILURE;
    if (!safe_id((const unsigned char *)"seat-41", 7, id) ||
        strcmp(id, "seat-41")) return EXIT_FAILURE;
    puts("SERVER_ID_VALIDATION_ONLY_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "tmpfile demonstra posse/cleanup de temporário ISO C; não reivindica atomic rename ou fsync POSIX.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(void) {
    FILE *temporary = tmpfile();
    if (!temporary) return EXIT_FAILURE;
    const char marker[] = "draft-v1";
    char out[sizeof marker] = {0};
    int ok = fwrite(marker, 1, sizeof marker, temporary) == sizeof marker &&
        fflush(temporary) == 0 && fseek(temporary, 0, SEEK_SET) == 0 &&
        fread(out, 1, sizeof out, temporary) == sizeof out &&
        memcmp(marker, out, sizeof marker) == 0;
    if (fclose(temporary) != 0) ok = 0;
    if (!ok) return EXIT_FAILURE;
    puts("TEMPORARY_READBACK_ONLY_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Parsing numérico e protocolos": [
    { lang: "c", purpose: "strtol confere errno, consumo total e intervalo de domínio antes de atualizar out.", code: `#include <errno.h>
#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

static int parse_quantity(const char *text, int *out) {
    if (!text || !out || !*text) return 0;
    for (const char *p = text; *p; ++p) if (*p < '0' || *p > '9') return 0;
    errno = 0;
    char *end = NULL;
    long value = strtol(text, &end, 10);
    if (errno == ERANGE || end == text || *end || value < 1 ||
        value > INT_MAX || value > 1000) return 0;
    *out = (int)value;
    return 1;
}

int main(void) {
    int quantity = 7;
    if (parse_quantity("3x", &quantity) || quantity != 7) return EXIT_FAILURE;
    if (parse_quantity("-1", &quantity) || quantity != 7) return EXIT_FAILURE;
    if (!parse_quantity("3", &quantity) || quantity != 3) return EXIT_FAILURE;
    puts("STRICT_NUMERIC_PARSE_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Frame length-prefix de dois bytes rejeita truncamento e excesso antes de publicar comprimento.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

static int frame_payload(const unsigned char *data, size_t available,
                         const unsigned char **out, size_t *length) {
    if (!data || !out || !length || available < 2) return 0;
    size_t declared = ((size_t)data[0] << 8) | data[1];
    if (declared > 1024 || declared != available - 2) return 0;
    *out = data + 2;
    *length = declared;
    return 1;
}

int main(void) {
    const unsigned char frame[5] = {0,3,'a',0,'b'};
    const unsigned char *payload = NULL;
    size_t length = 99;
    if (frame_payload(frame, 4, &payload, &length) || length != 99)
        return EXIT_FAILURE;
    if (!frame_payload(frame, sizeof frame, &payload, &length) ||
        length != 3 || payload[1] != 0) return EXIT_FAILURE;
    puts("FRAME_CONSUMPTION_EXACT_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Serialização e formatos versionados": [
    { lang: "c", purpose: "Encoder escreve campos em byte order explícita e nunca serializa struct/padding.", code: `#include <stdint.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int encode(uint32_t quantity, unsigned char out[8]) {
    if (!out || quantity == 0 || quantity > 1000) return 0;
    unsigned char tmp[8] = {'Q','R',1,0,0,0,0,0};
    tmp[4] = (unsigned char)(quantity >> 24);
    tmp[5] = (unsigned char)(quantity >> 16);
    tmp[6] = (unsigned char)(quantity >> 8);
    tmp[7] = (unsigned char)quantity;
    memcpy(out, tmp, sizeof tmp);
    return 1;
}

int main(void) {
    unsigned char bytes[8] = {0};
    const unsigned char expected[8] = {'Q','R',1,0,0,0,0,41};
    if (!encode(41, bytes) || memcmp(bytes, expected, 8)) return EXIT_FAILURE;
    puts("WIRE_BYTES_VERSIONED_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Decoder valida magic/version/range, preserva out em falha e rejeita versão futura.", code: `#include <stdint.h>
#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

static int decode(const unsigned char *data, size_t len, uint32_t *out) {
    if (!data || !out || len != 8 || data[0] != 'Q' || data[1] != 'R' ||
        data[2] != 1 || data[3] != 0) return 0;
    uint32_t quantity = ((uint32_t)data[4] << 24) |
        ((uint32_t)data[5] << 16) | ((uint32_t)data[6] << 8) | data[7];
    if (quantity == 0 || quantity > 1000) return 0;
    *out = quantity;
    return 1;
}

int main(void) {
    unsigned char wire[8] = {'Q','R',2,0,0,0,0,41};
    uint32_t quantity = 7;
    if (decode(wire, 8, &quantity) || quantity != 7) return EXIT_FAILURE;
    wire[2] = 1;
    if (!decode(wire, 8, &quantity) || quantity != 41) return EXIT_FAILURE;
    puts("UNKNOWN_VERSION_REJECTED_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Headers, guards e linkage": [
    { lang: "c", purpose: "Header self-contained embutido por macros para demonstrar include guard; gate real de duas translation units segue pendente.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

#ifndef RESERVATION_API_H
#define RESERVATION_API_H
struct reservation_context;
int reservation_try(struct reservation_context *ctx, size_t quantity);
#endif

struct reservation_context { size_t remaining; };
int reservation_try(struct reservation_context *ctx, size_t quantity) {
    if (!ctx || quantity == 0 || quantity > ctx->remaining) return 0;
    ctx->remaining -= quantity;
    return 1;
}

int main(void) {
    struct reservation_context ctx = {2};
    if (!reservation_try(&ctx, 1) || reservation_try(&ctx, 2) ||
        ctx.remaining != 1) return EXIT_FAILURE;
    puts("OPAQUE_API_LOCAL_DEMO_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Declaração extern e definição única no mesmo arquivo para demo; não prova link de módulos separados.", code: `#include <stdio.h>
#include <stdlib.h>

extern unsigned reservation_events;
unsigned reservation_events = 0;
static void record_event(void) { ++reservation_events; }

int main(void) {
    record_event(); record_event();
    if (reservation_events != 2) return EXIT_FAILURE;
    puts("EXTERN_DEFINITION_LOCAL_DEMO_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Make, dependências e reprodutibilidade": [
    { lang: "c", purpose: "Programa imprime macro de ABI exigida no build e rejeita valor errado; execução de Make é gate separado.", code: `#include <stdio.h>
#include <stdlib.h>

#ifndef RESERVATION_ABI_VERSION
#define RESERVATION_ABI_VERSION 1
#endif

int main(void) {
    if (RESERVATION_ABI_VERSION != 1) return EXIT_FAILURE;
    printf("ABI_VERSION=%d", RESERVATION_ABI_VERSION);
    putchar(10);
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Exemplo C17 de contrato de artefato novo via __STDC_VERSION__; .d e -MMD/-MP são comandos de build, não código C.", code: `#include <stdio.h>
#include <stdlib.h>

#if !defined(__STDC_VERSION__) || __STDC_VERSION__ < 201710L
#error "build exige C17"
#endif

static int check_fixture(int old_capacity, int reserved) {
    return old_capacity == 2 && reserved == 1 && old_capacity - reserved == 1;
}

int main(void) {
    if (!check_fixture(2, 1)) return EXIT_FAILURE;
    puts("C17_BUILD_FIXTURE_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Testes unitários e property testing": [
    { lang: "c", purpose: "Harness mantém checks ativos mesmo sob NDEBUG e mede estado, não apenas status.", code: `#include <stdio.h>
#include <stdlib.h>

static int failures = 0;
#define CHECK(condition) do { if (!(condition)) ++failures; } while (0)
static int reserve(int *remaining, int quantity) {
    if (!remaining || quantity <= 0 || quantity > *remaining) return 0;
    *remaining -= quantity;
    return 1;
}

int main(void) {
    int remaining = 1;
    CHECK(reserve(&remaining, 1));
    CHECK(remaining == 0);
    CHECK(!reserve(&remaining, 1));
    CHECK(remaining == 0);
    if (failures) return EXIT_FAILURE;
    puts("BUSINESS_ORACLE_ACTIVE_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Tabela de limites com sentinela observa out intacto para cada input inválido.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

static int parse(const unsigned char *data, size_t len, unsigned *out) {
    if (!data || !out || len != 1 || data[0] < '1' || data[0] > '9')
        return 0;
    *out = (unsigned)(data[0] - '0');
    return 1;
}

int main(void) {
    const unsigned char cases[][2] = {{0,0}, {'0',0}, {'9','x'}, {'x',0}};
    const size_t lengths[] = {0,1,2,1};
    for (size_t i = 0; i < 4; ++i) {
        unsigned out = 77;
        if (parse(cases[i], lengths[i], &out) || out != 77)
            return EXIT_FAILURE;
    }
    unsigned out = 77;
    if (!parse((const unsigned char *)"1", 1, &out) || out != 1)
        return EXIT_FAILURE;
    puts("BOUNDARY_SENTINELS_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Sanitizers e análise estática": [
    { lang: "c", purpose: "Checked signed addition evita UB; limite INT_MAX é exercitado sem precisar de overflow real.", code: `#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

static int checked_add(int a, int b, int *out) {
    if (!out || (b > 0 && a > INT_MAX - b) ||
        (b < 0 && a < INT_MIN - b)) return 0;
    *out = a + b;
    return 1;
}

int main(void) {
    int result = 7;
    if (checked_add(INT_MAX, 1, &result) || result != 7)
        return EXIT_FAILURE;
    if (!checked_add(20, 21, &result) || result != 41)
        return EXIT_FAILURE;
    puts("SIGNED_OVERFLOW_PREVENTED_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Buffer com tamanho explícito rejeita one-past; ASan/UBSan e Release continuam gates futuros.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int copy_text(char *dst, size_t capacity,
                     const char *src, size_t length) {
    if (!dst || !src || capacity == 0 || length >= capacity) return 0;
    memcpy(dst, src, length);
    dst[length] = 0;
    return 1;
}

int main(void) {
    char buffer[4] = "old";
    if (copy_text(buffer, sizeof buffer, "abcd", 4) ||
        strcmp(buffer, "old")) return EXIT_FAILURE;
    if (!copy_text(buffer, sizeof buffer, "abc", 3) ||
        strcmp(buffer, "abc")) return EXIT_FAILURE;
    puts("EXACT_CAPACITY_BOUND_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "qsort, bsearch e comparadores": [
    { lang: "c", purpose: "Comparador relacional evita subtração/overflow e qsort ordena extremos antes de bsearch.", code: `#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

static int compare_int(const void *left, const void *right) {
    int a = *(const int *)left, b = *(const int *)right;
    return (a > b) - (a < b);
}

int main(void) {
    int values[] = {INT_MAX, 0, INT_MIN, 41, -1};
    qsort(values, 5, sizeof values[0], compare_int);
    for (size_t i = 1; i < 5; ++i)
        if (values[i - 1] > values[i]) return EXIT_FAILURE;
    int needle = INT_MAX;
    int *found = bsearch(&needle, values, 5, sizeof values[0], compare_int);
    if (!found || *found != INT_MAX) return EXIT_FAILURE;
    puts("QSORT_BSEARCH_EXTREMES_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Ordenação por tenant+ID define desempate; bsearch usa exatamente o mesmo comparador.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct key { char tenant[8]; unsigned id; };
static int compare_key(const void *left, const void *right) {
    const struct key *a = left, *b = right;
    int tenant = strcmp(a->tenant, b->tenant);
    if (tenant) return tenant;
    return (a->id > b->id) - (a->id < b->id);
}

int main(void) {
    struct key rows[] = {{{"b"},41}, {{"a"},42}, {{"a"},41}};
    struct key needle = {{"a"},41};
    qsort(rows, 3, sizeof rows[0], compare_key);
    const struct key *found = bsearch(&needle, rows, 3,
                                      sizeof rows[0], compare_key);
    if (!found || strcmp(found->tenant, "a") || found->id != 41)
        return EXIT_FAILURE;
    puts("COMPOSITE_SORT_SEARCH_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Tempo, relógios e locale": [
    { lang: "c", purpose: "Deadline com clock abstrato/fake não é estendido quando horário de parede volta; adapter monotônico real é gate externo.", code: `#include <stdio.h>
#include <stdlib.h>

struct clock_sample { long monotonic_ms; long wall_s; };
static int expired(long started_ms, long now_ms, long budget_ms) {
    if (started_ms < 0 || now_ms < 0 || budget_ms < 0 ||
        now_ms < started_ms) return 1;
    return now_ms - started_ms >= budget_ms;
}

int main(void) {
    struct clock_sample start = {1000, 100000};
    struct clock_sample later = {1600, 99000}; /* parede retrocedeu */
    if (!expired(start.monotonic_ms, later.monotonic_ms, 500))
        return EXIT_FAILURE;
    puts("MONOTONIC_FAKE_DEADLINE_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "time/strftime formatam UTC para apresentação; não os usa como relógio monotônico.", code: `#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main(void) {
    time_t instant = (time_t)0;
    struct tm *utc = gmtime(&instant);
    if (!utc) return EXIT_FAILURE;
    char text[32];
    if (!strftime(text, sizeof text, "%Y-%m-%dT%H:%M:%SZ", utc))
        return EXIT_FAILURE;
    printf("UTC=%s", text);
    putchar(10);
    puts("WALL_TIME_FOR_DISPLAY_ONLY_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Ponto flutuante e arredondamento": [
    { lang: "c", purpose: "Parse de duas casas decimais para centavos usa dígitos inteiros e limite antes de somar.", code: `#include <limits.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int parse_cents(const char *s, long *out) {
    if (!s || !out || !*s) return 0;
    long whole = 0;
    const char *p = s;
    while (*p >= '0' && *p <= '9') {
        int digit = *p++ - '0';
        if (whole > (LONG_MAX - digit) / 10) return 0;
        whole = whole * 10 + digit;
    }
    if (p == s || *p++ != '.' || p[0] < '0' || p[0] > '9' ||
        p[1] < '0' || p[1] > '9' || p[2] != 0) return 0;
    long fraction = (p[0] - '0') * 10 + (p[1] - '0');
    if (whole > (LONG_MAX - fraction) / 100) return 0;
    long cents = whole * 100 + fraction;
    *out = cents;
    return 1;
}

int main(void) {
    long cents = 7;
    if (!parse_cents("0.29", &cents) || cents != 29) return EXIT_FAILURE;
    if (parse_cents("0.299", &cents) || cents != 29) return EXIT_FAILURE;
    puts("EXACT_MINOR_UNITS_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "isfinite rejeita NaN/Infinity em dado aproximado; dinheiro ainda requer escala inteira.", code: `#include <math.h>
#include <stdio.h>
#include <stdlib.h>

static int acceptable_estimate(double value) {
    return isfinite(value) && value >= 0.0 && value <= 1000.0;
}

int main(void) {
    if (acceptable_estimate(NAN) || acceptable_estimate(INFINITY) ||
        acceptable_estimate(-INFINITY) || !acceptable_estimate(41.5))
        return EXIT_FAILURE;
    puts("NONFINITE_REJECTED_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Aleatoriedade, sementes e chaves": [
    { lang: "c", purpose: "Bytes CSPRNG injetados são codificados integralmente, inclusive NUL; origem OS real é gate separado.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int hex_encode(const unsigned char *bytes, size_t len,
                      char *out, size_t capacity) {
    static const char alphabet[] = "0123456789abcdef";
    if (!bytes || !out || len > (size_t)-1 / 2 || capacity <= 2 * len)
        return 0;
    for (size_t i = 0; i < len; ++i) {
        out[2*i] = alphabet[bytes[i] >> 4];
        out[2*i+1] = alphabet[bytes[i] & 15];
    }
    out[2*len] = 0;
    return 1;
}

int main(void) {
    const unsigned char supplied[3] = {0, 255, 41};
    char key[7];
    if (!hex_encode(supplied, 3, key, sizeof key) ||
        strcmp(key, "00ff29")) return EXIT_FAILURE;
    puts("ENTROPY_BYTES_NOT_TRUNCATED_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Retry reutiliza key estável após timeout ambíguo; fake registra uma única intenção por key.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct provider { char first_key[16]; int calls; int effects; };
static int send(struct provider *p, const char *key) {
    ++p->calls;
    if (!p->first_key[0]) {
        strcpy(p->first_key, key); /* fixture controlada; API real valida comprimento */
        ++p->effects;
        return 0; /* timeout depois do efeito */
    }
    return strcmp(p->first_key, key) == 0;
}

int main(void) {
    struct provider p = {{0}, 0, 0};
    const char *durable_key = "reservation-41";
    if (send(&p, durable_key)) return EXIT_FAILURE;
    if (!send(&p, durable_key) || p.calls != 2 || p.effects != 1)
        return EXIT_FAILURE;
    puts("STABLE_RETRY_KEY_FAKE_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Threads C11 e sincronização": [
    { lang: "c", purpose: "Duas threads C11 usam mutex para a guarda e atualização da última vaga; requer threads.h no alvo.", code: `#include <threads.h>
#include <stdio.h>
#include <stdlib.h>

struct state { mtx_t mutex; int remaining; int successes; };
static int worker(void *arg) {
    struct state *s = arg;
    if (mtx_lock(&s->mutex) != thrd_success) return 1;
    if (s->remaining > 0) { --s->remaining; ++s->successes; }
    if (mtx_unlock(&s->mutex) != thrd_success) return 1;
    return 0;
}

int main(void) {
    struct state s = {0};
    s.remaining = 1;
    if (mtx_init(&s.mutex, mtx_plain) != thrd_success) return EXIT_FAILURE;
    thrd_t a, b;
    if (thrd_create(&a, worker, &s) != thrd_success) return EXIT_FAILURE;
    if (thrd_create(&b, worker, &s) != thrd_success) return EXIT_FAILURE;
    int ra = 1, rb = 1;
    if (thrd_join(a, &ra) != thrd_success ||
        thrd_join(b, &rb) != thrd_success) return EXIT_FAILURE;
    mtx_destroy(&s.mutex);
    if (ra || rb || s.remaining != 0 || s.successes != 1) return EXIT_FAILURE;
    puts("THREAD_MUTEX_LAST_SEAT_LOCAL_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Condition variable reavalia predicado em while; shutdown acorda waiter e join precede destroy.", code: `#include <threads.h>
#include <stdio.h>
#include <stdlib.h>

struct queue { mtx_t mutex; cnd_t changed; int ready, stopping, consumed; };
static int consumer(void *arg) {
    struct queue *q = arg;
    if (mtx_lock(&q->mutex) != thrd_success) return 1;
    while (!q->ready && !q->stopping)
        if (cnd_wait(&q->changed, &q->mutex) != thrd_success) {
            mtx_unlock(&q->mutex); return 1;
        }
    if (q->ready) ++q->consumed;
    if (mtx_unlock(&q->mutex) != thrd_success) return 1;
    return 0;
}

int main(void) {
    struct queue q = {0};
    if (mtx_init(&q.mutex, mtx_plain) != thrd_success) return EXIT_FAILURE;
    if (cnd_init(&q.changed) != thrd_success) return EXIT_FAILURE;
    thrd_t thread;
    if (thrd_create(&thread, consumer, &q) != thrd_success) return EXIT_FAILURE;
    if (mtx_lock(&q.mutex) != thrd_success) return EXIT_FAILURE;
    q.ready = 1; cnd_signal(&q.changed);
    mtx_unlock(&q.mutex);
    int rc = 1;
    if (thrd_join(thread, &rc) != thrd_success) return EXIT_FAILURE;
    cnd_destroy(&q.changed); mtx_destroy(&q.mutex);
    if (rc || q.consumed != 1) return EXIT_FAILURE;
    puts("CONDITION_PREDICATE_LOOP_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Atomics e memory order": [
    { lang: "c", purpose: "CAS protege contador local sem check-then-sub separado; ainda não representa transação SQL.", code: `#include <stdatomic.h>
#include <stdio.h>
#include <stdlib.h>

static int take_one(atomic_int *remaining) {
    int observed = atomic_load(remaining);
    while (observed > 0) {
        if (atomic_compare_exchange_weak(remaining, &observed,
                                         observed - 1)) return 1;
    }
    return 0;
}

int main(void) {
    atomic_int remaining = ATOMIC_VAR_INIT(1);
    if (!take_one(&remaining) || take_one(&remaining) ||
        atomic_load(&remaining) != 0) return EXIT_FAILURE;
    puts("ATOMIC_CAS_LOCAL_ONLY_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Release/acquire publica payload imutável entre duas threads; ownership dura até join.", code: `#include <stdatomic.h>
#include <threads.h>
#include <stdio.h>
#include <stdlib.h>

struct publication { atomic_int ready; int payload; };
static int producer(void *arg) {
    struct publication *p = arg;
    p->payload = 41;
    atomic_store_explicit(&p->ready, 1, memory_order_release);
    return 0;
}
static int consumer(void *arg) {
    struct publication *p = arg;
    while (!atomic_load_explicit(&p->ready, memory_order_acquire)) thrd_yield();
    return p->payload == 41 ? 0 : 1;
}

int main(void) {
    struct publication p = {ATOMIC_VAR_INIT(0), 0};
    thrd_t a, b;
    if (thrd_create(&b, consumer, &p) != thrd_success) return EXIT_FAILURE;
    if (thrd_create(&a, producer, &p) != thrd_success) return EXIT_FAILURE;
    int ra = 1, rb = 1;
    if (thrd_join(a, &ra) != thrd_success ||
        thrd_join(b, &rb) != thrd_success || ra || rb) return EXIT_FAILURE;
    puts("RELEASE_ACQUIRE_PUBLICATION_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Filas bounded e backpressure": [
    { lang: "c", purpose: "Ring buffer de capacidade fixa distingue vazio/cheio por length e conserva ordem após wrap.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

struct ring { int data[3]; size_t head, tail, length; };
static int push(struct ring *q, int value) {
    if (!q || q->length == 3) return 0;
    q->data[q->tail] = value;
    q->tail = (q->tail + 1) % 3;
    ++q->length;
    return 1;
}
static int pop(struct ring *q, int *out) {
    if (!q || !out || q->length == 0) return 0;
    *out = q->data[q->head];
    q->head = (q->head + 1) % 3;
    --q->length;
    return 1;
}

int main(void) {
    struct ring q = {0}; int value = 0;
    if (!push(&q, 1) || !push(&q, 2) || !push(&q, 3) || push(&q, 4))
        return EXIT_FAILURE;
    if (!pop(&q, &value) || value != 1 || !push(&q, 4))
        return EXIT_FAILURE;
    for (int expected = 2; expected <= 4; ++expected)
        if (!pop(&q, &value) || value != expected) return EXIT_FAILURE;
    if (pop(&q, &value) || q.length != 0) return EXIT_FAILURE;
    puts("BOUNDED_RING_WRAP_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Backpressure recusa enqueue quando cheio e mantém ownership no caller; outbox real é gate separado.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

struct queue { unsigned ids[2]; size_t count; };
static int enqueue(struct queue *q, unsigned *owned_id) {
    if (!q || !owned_id || !*owned_id || q->count == 2) return 0;
    q->ids[q->count++] = *owned_id;
    *owned_id = 0;
    return 1;
}

int main(void) {
    struct queue q = {0};
    unsigned first = 41, second = 42, third = 43;
    if (!enqueue(&q, &first) || !enqueue(&q, &second) ||
        enqueue(&q, &third) || third != 43 || q.count != 2)
        return EXIT_FAILURE;
    puts("BACKPRESSURE_RETAINS_CALLER_ITEM_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Race testing e escopo distribuído": [
    { lang: "c", purpose: "Modelo local de duas tentativas exige um único sucesso; não afirma cobrir duas sessões de banco.", code: `#include <stdio.h>
#include <stdlib.h>

struct local_state { int remaining, confirmed, outbox; };
static int try_local(struct local_state *s) {
    if (!s || s->remaining < 1) return 0;
    --s->remaining;
    ++s->confirmed;
    ++s->outbox;
    return 1;
}

int main(void) {
    struct local_state s = {1,0,0};
    int first = try_local(&s), second = try_local(&s);
    if (!first || second || s.remaining != 0 ||
        s.confirmed != 1 || s.outbox != 1) return EXIT_FAILURE;
    puts("LOCAL_MODEL_NOT_DISTRIBUTED_GATE_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Fake remoto confirma efeito antes do timeout; replay com mesma key não duplica.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct remote { char accepted[24]; int effects, calls; };
static int post(struct remote *r, const char *key) {
    ++r->calls;
    if (!r->accepted[0]) {
        size_t len = strlen(key);
        if (len >= sizeof r->accepted) return -1;
        memcpy(r->accepted, key, len + 1);
        ++r->effects;
        return 0; /* timeout ambíguo após efeito */
    }
    return strcmp(r->accepted, key) == 0 ? 1 : -1;
}

int main(void) {
    struct remote r = {{0},0,0};
    const char *key = "event-41";
    if (post(&r, key) != 0 || post(&r, key) != 1 ||
        r.effects != 1 || r.calls != 2) return EXIT_FAILURE;
    puts("AMBIGUOUS_REMOTE_REPLAY_FAKE_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Sockets e framing": [
    { lang: "c", purpose: "Parser C17 acumula dois fragmentos de frame e só publica payload após comprimento completo; não abre socket.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct parser { unsigned char bytes[6]; size_t used; };
static int feed(struct parser *p, const unsigned char *src, size_t len) {
    if (!p || !src || len > sizeof p->bytes - p->used) return 0;
    memcpy(p->bytes + p->used, src, len);
    p->used += len;
    return 1;
}
static int complete(const struct parser *p) {
    return p->used >= 2 && p->bytes[0] == 1 &&
        p->bytes[1] <= 4 && p->used == (size_t)p->bytes[1] + 2;
}

int main(void) {
    struct parser p = {{0},0};
    const unsigned char a[2] = {1,3}, b[3] = {'a',0,'b'};
    if (!feed(&p, a, 2) || complete(&p)) return EXIT_FAILURE;
    if (!feed(&p, b, 3) || !complete(&p) || p.bytes[3] != 0)
        return EXIT_FAILURE;
    puts("FRAGMENTED_FRAME_PARSER_ONLY_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Fake de send parcial mantém offset e compara stream; adapter POSIX/WinSock fica em gate separado.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct fake_socket { unsigned char wire[8]; size_t used; };
static size_t send_some(struct fake_socket *s, const unsigned char *src,
                        size_t len) {
    size_t n = len > 2 ? 2 : len;
    memcpy(s->wire + s->used, src, n);
    s->used += n;
    return n;
}

int main(void) {
    const unsigned char frame[5] = {1,3,'a',0,'b'};
    struct fake_socket socket = {{0},0};
    size_t sent = 0;
    while (sent < sizeof frame) {
        size_t n = send_some(&socket, frame + sent, sizeof frame - sent);
        if (!n) return EXIT_FAILURE;
        sent += n;
    }
    if (socket.used != sizeof frame || memcmp(socket.wire, frame, sizeof frame))
        return EXIT_FAILURE;
    puts("PARTIAL_SEND_OFFSET_FAKE_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "HTTP, TLS e idempotência": [
    { lang: "c", purpose: "Máquina local de idempotência retorna replay para mesma key/fingerprint e conflito para corpo diferente.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct store { char key[16]; char fingerprint[16]; int effects; };
enum result { CREATED, REPLAY, CONFLICT };
static enum result apply(struct store *s, const char *key, const char *fp) {
    if (!s->key[0]) {
        if (strlen(key) >= sizeof s->key || strlen(fp) >= sizeof s->fingerprint)
            return CONFLICT;
        strcpy(s->key, key); strcpy(s->fingerprint, fp);
        ++s->effects;
        return CREATED;
    }
    return strcmp(s->key, key) == 0 && strcmp(s->fingerprint, fp) == 0
        ? REPLAY : CONFLICT;
}

int main(void) {
    struct store s = {{0},{0},0};
    if (apply(&s, "k41", "f41") != CREATED ||
        apply(&s, "k41", "f41") != REPLAY ||
        apply(&s, "k41", "other") != CONFLICT || s.effects != 1)
        return EXIT_FAILURE;
    puts("IDEMPOTENCY_STATE_FAKE_NOT_DB_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "TLS policy local falha fechado para hostname/certificado inválido; handshake de biblioteca real não é exercitado.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int permitted_tls(const char *expected, const char *presented,
                         int chain_valid, int expired) {
    return expected && presented && chain_valid && !expired &&
        strcmp(expected, presented) == 0;
}

int main(void) {
    if (permitted_tls("api.example", "evil.example", 1, 0) ||
        permitted_tls("api.example", "api.example", 0, 0) ||
        permitted_tls("api.example", "api.example", 1, 1) ||
        !permitted_tls("api.example", "api.example", 1, 0))
        return EXIT_FAILURE;
    puts("TLS_POLICY_ONLY_NOT_HANDSHAKE_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Validação, overflow e format strings": [
    { lang: "c", purpose: "snprintf usa formato literal, verifica truncamento e preserva out em erro.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int format_id(unsigned id, char *out, size_t capacity) {
    if (!out || !capacity) return 0;
    char temp[32];
    int n = snprintf(temp, sizeof temp, "reservation-%u", id);
    if (n < 0 || (size_t)n >= sizeof temp || (size_t)n >= capacity) return 0;
    memcpy(out, temp, (size_t)n + 1);
    return 1;
}

int main(void) {
    char out[16] = "old";
    if (format_id(41, out, 4) || strcmp(out, "old")) return EXIT_FAILURE;
    if (!format_id(41, out, sizeof out) || strcmp(out, "reservation-41"))
        return EXIT_FAILURE;
    puts("FORMAT_LITERAL_AND_TRUNCATION_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Input hostil de formato é impresso como dados via fputs, não executado como format string.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int safe_log(FILE *out, const char *message) {
    if (!out || !message || strlen(message) > 32) return 0;
    return fputs(message, out) >= 0 && fputc(10, out) != EOF;
}

int main(void) {
    FILE *f = tmpfile();
    if (!f) return EXIT_FAILURE;
    const char *hostile = "%p %n %x";
    char readback[32] = {0};
    if (!safe_log(f, hostile) || fflush(f) || fseek(f, 0, SEEK_SET) ||
        !fgets(readback, sizeof readback, f)) return EXIT_FAILURE;
    if (strncmp(readback, hostile, strlen(hostile))) return EXIT_FAILURE;
    if (fclose(f)) return EXIT_FAILURE;
    puts("FORMAT_INPUT_AS_DATA_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Segredos, logs e privilégio": [
    { lang: "c", purpose: "Logger de erro registra operation code/eventId sem token; fixture confere ausência do segredo.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int log_error(FILE *out, unsigned event_id, int code) {
    return fprintf(out, "event=%u code=%d\n", event_id, code) > 0;
}

int main(void) {
    const char *secret = "fake-secret-123";
    FILE *f = tmpfile();
    if (!f) return EXIT_FAILURE;
    if (!log_error(f, 41, 503) || fflush(f) || fseek(f, 0, SEEK_SET))
        return EXIT_FAILURE;
    char line[80] = {0};
    if (!fgets(line, sizeof line, f) || strstr(line, secret) ||
        !strstr(line, "event=41")) return EXIT_FAILURE;
    if (fclose(f)) return EXIT_FAILURE;
    puts("SECRET_REDACTION_FIXTURE_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Configuração fail-closed exige segredo e verificação TLS; não cria fallback insecure.", code: `#include <stdio.h>
#include <stdlib.h>

struct config { const char *token; int tls_verify; int production; };
static int valid(struct config c) {
    if (!c.token || !c.token[0]) return 0;
    if (c.production && !c.tls_verify) return 0;
    return 1;
}

int main(void) {
    struct config missing = {NULL,1,1};
    struct config insecure = {"fake",0,1};
    struct config secure = {"fake",1,1};
    if (valid(missing) || valid(insecure) || !valid(secure))
        return EXIT_FAILURE;
    puts("PRODUCTION_CONFIG_FAIL_CLOSED_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Profiling, cache e alocação": [
    { lang: "c", purpose: "Contador de alocações injetado compara estratégia por operação sem fingir medir wall-clock.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

struct arena { unsigned char bytes[128]; size_t used, allocations; };
static void *arena_take(struct arena *a, size_t n) {
    if (!a || n == 0 || n > sizeof a->bytes - a->used) return NULL;
    void *result = a->bytes + a->used;
    a->used += n; ++a->allocations;
    return result;
}

int main(void) {
    struct arena a = {{0},0,0};
    int *first = arena_take(&a, sizeof *first);
    int *second = arena_take(&a, sizeof *second);
    if (!first || !second || a.allocations != 2) return EXIT_FAILURE;
    *first = 20; *second = 21;
    if (*first + *second != 41 || arena_take(&a, 128)) return EXIT_FAILURE;
    puts("ALLOCATION_COUNTER_FIXTURE_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Snapshot owned continua válido depois de origem ser reutilizada; performance nunca troca lifetime por ponteiro emprestado.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct snapshot { char key[16]; };
static int snapshot_key(struct snapshot *out, const char *borrowed) {
    if (!out || !borrowed) return 0;
    size_t n = strlen(borrowed);
    if (n >= sizeof out->key) return 0;
    memcpy(out->key, borrowed, n + 1);
    return 1;
}

int main(void) {
    char request[16] = "tenant-a";
    struct snapshot s = {{0}};
    if (!snapshot_key(&s, request)) return EXIT_FAILURE;
    strcpy(request, "tenant-b");
    if (strcmp(s.key, "tenant-a")) return EXIT_FAILURE;
    puts("PROFILE_WITH_SAFE_LIFETIME_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Undefined behavior e otimização": [
    { lang: "c", purpose: "Soma signed é validada antes da operação, preservando out em limite sem executar UB.", code: `#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

static int add_checked(int a, int b, int *out) {
    if (!out || (b > 0 && a > INT_MAX - b) ||
        (b < 0 && a < INT_MIN - b)) return 0;
    *out = a + b;
    return 1;
}

int main(void) {
    int out = 7;
    if (add_checked(INT_MAX, 1, &out) || out != 7) return EXIT_FAILURE;
    if (!add_checked(40, 1, &out) || out != 41) return EXIT_FAILURE;
    puts("NO_SIGNED_OVERFLOW_EXECUTED_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Shift valida largura e usa unsigned; casos inválidos não executam a expressão indefinida.", code: `#include <limits.h>
#include <stdio.h>
#include <stdlib.h>

static int bit_mask(unsigned bit, unsigned *out) {
    unsigned width = (unsigned)(sizeof(unsigned) * CHAR_BIT);
    if (!out || bit >= width) return 0;
    *out = 1u << bit;
    return 1;
}

int main(void) {
    unsigned out = 7, width = (unsigned)(sizeof(unsigned) * CHAR_BIT);
    if (bit_mask(width, &out) || out != 7) return EXIT_FAILURE;
    if (!bit_mask(0, &out) || out != 1u) return EXIT_FAILURE;
    puts("SHIFT_RANGE_GUARDED_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "ABI, endianness e largura": [
    { lang: "c", purpose: "Inteiro é codificado em ordem de bytes explícita, independente do layout de uint32_t em memória.", code: `#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

static void put_u32_be(unsigned char out[4], uint32_t value) {
    out[0] = (unsigned char)(value >> 24);
    out[1] = (unsigned char)(value >> 16);
    out[2] = (unsigned char)(value >> 8);
    out[3] = (unsigned char)value;
}

int main(void) {
    unsigned char bytes[4];
    put_u32_be(bytes, 41);
    if (bytes[0] || bytes[1] || bytes[2] || bytes[3] != 41)
        return EXIT_FAILURE;
    puts("EXPLICIT_BIG_ENDIAN_BYTES_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "ABI pública versionada valida struct_size antes de acessar campo opcional; biblioteca dinâmica real é gate separado.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

struct api_v1 { size_t struct_size; unsigned abi_version; unsigned id; };
static int read_id(const struct api_v1 *value, unsigned *out) {
    if (!value || !out || value->abi_version != 1 ||
        value->struct_size < offsetof(struct api_v1, id) + sizeof value->id)
        return 0;
    *out = value->id;
    return 1;
}

int main(void) {
    struct api_v1 value = {sizeof value, 1, 41};
    unsigned id = 0;
    if (!read_id(&value, &id) || id != 41) return EXIT_FAILURE;
    value.struct_size = offsetof(struct api_v1, id);
    if (read_id(&value, &id)) return EXIT_FAILURE;
    puts("VERSIONED_STRUCT_SIZE_GUARD_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Métricas, tracing e diagnósticos": [
    { lang: "c", purpose: "Métricas bounded agregam outcomes sem usar tenant/key como label de alta cardinalidade.", code: `#include <stdio.h>
#include <stdlib.h>

enum outcome { CREATED, REPLAYED, CONFLICTED, UNAVAILABLE, OUTCOME_COUNT };
struct metrics { unsigned long counts[OUTCOME_COUNT]; };
static int record(struct metrics *m, enum outcome outcome) {
    if (!m || outcome < 0 || outcome >= OUTCOME_COUNT) return 0;
    ++m->counts[outcome];
    return 1;
}

int main(void) {
    struct metrics m = {{0}};
    if (!record(&m, CREATED) || !record(&m, REPLAYED) ||
        record(&m, (enum outcome)99)) return EXIT_FAILURE;
    if (m.counts[CREATED] != 1 || m.counts[REPLAYED] != 1)
        return EXIT_FAILURE;
    puts("BOUNDED_OUTCOME_METRICS_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Health separa readiness de liveness e fica não-ready durante backpressure/shutdown.", code: `#include <stdio.h>
#include <stdlib.h>

struct health { int process_alive, db_writable, queue_full, stopping; };
static int live(struct health h) { return h.process_alive; }
static int ready(struct health h) {
    return h.process_alive && h.db_writable && !h.queue_full && !h.stopping;
}

int main(void) {
    struct health h = {1,1,0,0};
    if (!live(h) || !ready(h)) return EXIT_FAILURE;
    h.queue_full = 1;
    if (!live(h) || ready(h)) return EXIT_FAILURE;
    h.queue_full = 0; h.stopping = 1;
    if (!live(h) || ready(h)) return EXIT_FAILURE;
    puts("LIVENESS_READINESS_DISTINCT_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "SQLite ou driver SQL em C": [
    { lang: "c", purpose: "Boundary abstrato de statement mantém SQL constante e binds separados; driver real é gate pendente.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct statement { const char *sql; const char *tenant; int quantity; };
static int prepare_reserve(struct statement *s, const char *tenant, int quantity) {
    static const char sql[] = "UPDATE inventory SET remaining=remaining-? WHERE tenant=? AND remaining>=?";
    if (!s || !tenant || !*tenant || quantity <= 0) return 0;
    s->sql = sql; s->tenant = tenant; s->quantity = quantity;
    return 1;
}

int main(void) {
    struct statement s = {0};
    const char *hostile = "a' OR 1=1 --";
    if (!prepare_reserve(&s, hostile, 1) || strcmp(s.tenant, hostile) ||
        strstr(s.sql, hostile)) return EXIT_FAILURE;
    puts("PARAMETER_BOUNDARY_MODEL_ONLY_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Modelo de row count só confirma exatamente uma linha; SQL concorrente real permanece separado.", code: `#include <stdio.h>
#include <stdlib.h>

enum outcome { DB_CREATED, DB_SOLD_OUT, DB_ERROR };
static enum outcome map_changes(int execute_ok, long changed_rows) {
    if (!execute_ok || changed_rows < 0 || changed_rows > 1) return DB_ERROR;
    return changed_rows == 1 ? DB_CREATED : DB_SOLD_OUT;
}

int main(void) {
    if (map_changes(1, 1) != DB_CREATED || map_changes(1, 0) != DB_SOLD_OUT ||
        map_changes(0, 0) != DB_ERROR || map_changes(1, 2) != DB_ERROR)
        return EXIT_FAILURE;
    puts("ROW_COUNT_CONTRACT_MODEL_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Transações, constraints e outbox": [
    { lang: "c", purpose: "Modelo transacional aplica capacidade, key e outbox juntos ou preserva estado quando falha é injetada.", code: `#include <stdio.h>
#include <stdlib.h>

struct db { int remaining, reservations, outbox; };
static int transact(struct db *db, int fail_after_capacity) {
    if (!db || db->remaining < 1) return 0;
    struct db next = *db;
    --next.remaining; ++next.reservations;
    if (fail_after_capacity) return 0;
    ++next.outbox;
    *db = next;
    return 1;
}

int main(void) {
    struct db db = {1,0,0};
    if (transact(&db, 1) || db.remaining != 1 || db.reservations || db.outbox)
        return EXIT_FAILURE;
    if (!transact(&db, 0) || db.remaining || db.reservations != 1 || db.outbox != 1)
        return EXIT_FAILURE;
    puts("TRANSACTION_MODEL_ALL_OR_NOTHING_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Outbox fake redelivers eventId estável e provedor deduplica; não reivindica exactly-once distribuído.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct provider { char event_id[16]; int effects; };
static int deliver(struct provider *p, const char *event_id) {
    if (!p || !event_id || strlen(event_id) >= sizeof p->event_id) return 0;
    if (!p->event_id[0]) { strcpy(p->event_id, event_id); ++p->effects; return 1; }
    return strcmp(p->event_id, event_id) == 0;
}

int main(void) {
    struct provider p = {{0},0};
    if (!deliver(&p, "evt-41") || !deliver(&p, "evt-41") || p.effects != 1)
        return EXIT_FAILURE;
    puts("OUTBOX_REDELIVERY_FAKE_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Bibliotecas C e FFI": [
    { lang: "c", purpose: "Handle opaco local usa create/destroy da biblioteca; exportação/ABI dinâmica é gate separado.", code: `#include <stdio.h>
#include <stdlib.h>

typedef struct chiron_context chiron_context;
struct chiron_context { unsigned abi_version; int remaining; };
static chiron_context *chiron_create(void) {
    chiron_context *ctx = malloc(sizeof *ctx);
    if (ctx) { ctx->abi_version = 1; ctx->remaining = 1; }
    return ctx;
}
static void chiron_destroy(chiron_context *ctx) { free(ctx); }

int main(void) {
    chiron_context *ctx = chiron_create();
    if (!ctx || ctx->abi_version != 1 || ctx->remaining != 1) return EXIT_FAILURE;
    chiron_destroy(ctx);
    puts("OPAQUE_HANDLE_LIFETIME_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Erro é copiado para buffer do caller com truncamento detectado, sem retorno de static mutável.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

static int error_message(int code, char *out, size_t capacity) {
    const char *message = code == 409 ? "conflict" : "unavailable";
    size_t n = strlen(message);
    if (!out || capacity <= n) return 0;
    memcpy(out, message, n + 1);
    return 1;
}

int main(void) {
    char a[16], b[16];
    if (!error_message(409, a, sizeof a) || !error_message(503, b, sizeof b) ||
        strcmp(a, "conflict") || strcmp(b, "unavailable")) return EXIT_FAILURE;
    if (error_message(409, a, 4)) return EXIT_FAILURE;
    puts("FFI_CALLER_BUFFER_ERROR_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Deploy, crash e recuperação": [
    { lang: "c", purpose: "Máquina de recuperação mantém pending após crash point e conclui com mesmo eventId.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

enum status { PENDING, SENT };
struct durable_row { char event_id[16]; enum status status; };
static int recover(struct durable_row *row, const char *observed_event) {
    if (!row || row->status != PENDING || !observed_event) return 0;
    if (strcmp(row->event_id, observed_event) != 0) return 0;
    row->status = SENT;
    return 1;
}

int main(void) {
    struct durable_row restored = {{"evt-41"}, PENDING};
    if (recover(&restored, "other") || restored.status != PENDING)
        return EXIT_FAILURE;
    if (!recover(&restored, "evt-41") || restored.status != SENT)
        return EXIT_FAILURE;
    puts("RECOVERY_SAME_EVENT_ID_MODEL_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Manifesto de restore valida versão, checksum e presença das quatro famílias de estado.", code: `#include <stdio.h>
#include <stdlib.h>

struct manifest { unsigned version, checksum_ok; int keys, reservations, outbox, schema; };
static int restorable(struct manifest m) {
    return m.version == 1 && m.checksum_ok && m.keys && m.reservations &&
        m.outbox && m.schema;
}

int main(void) {
    struct manifest complete = {1,1,1,1,1,1};
    struct manifest missing_keys = {1,1,0,1,1,1};
    struct manifest corrupt = {1,0,1,1,1,1};
    if (!restorable(complete) || restorable(missing_keys) || restorable(corrupt))
        return EXIT_FAILURE;
    puts("RESTORE_MANIFEST_MODEL_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "API C de reserva e ownership": [
    { lang: "c", purpose: "API valida versão/tamanho/request e só publica out completo no sucesso.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

struct request { size_t struct_size; unsigned version; const unsigned char *key; size_t key_len; int quantity; };
struct result { unsigned reservation_id; int remaining; };
static int reserve(const struct request *r, struct result *out) {
    if (!r || !out || r->struct_size < sizeof *r || r->version != 1 ||
        !r->key || r->key_len == 0 || r->key_len > 16 || r->quantity != 1)
        return 0;
    struct result tmp = {41, 0};
    *out = tmp;
    return 1;
}

int main(void) {
    const unsigned char key[2] = {'k','1'};
    struct request r = {sizeof r,1,key,2,1};
    struct result out = {7,7};
    if (!reserve(&r, &out) || out.reservation_id != 41 || out.remaining != 0)
        return EXIT_FAILURE;
    r.key_len = 0; out = (struct result){7,7};
    if (reserve(&r, &out) || out.reservation_id != 7) return EXIT_FAILURE;
    puts("FINAL_API_ATOMIC_RESULT_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Contexto opaco adquire key para além da chamada e libera por destroy próprio.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct chiron chiron;
struct chiron { char *key; };
static chiron *chiron_create(const char *key) {
    if (!key || strlen(key) > 16) return NULL;
    chiron *ctx = calloc(1, sizeof *ctx);
    if (!ctx) return NULL;
    ctx->key = malloc(strlen(key) + 1);
    if (!ctx->key) { free(ctx); return NULL; }
    strcpy(ctx->key, key);
    return ctx;
}
static void chiron_destroy(chiron *ctx) { if (ctx) { free(ctx->key); free(ctx); } }

int main(void) {
    char request[8] = "key-41";
    chiron *ctx = chiron_create(request);
    if (!ctx) return EXIT_FAILURE;
    strcpy(request, "changed");
    int ok = strcmp(ctx->key, "key-41") == 0;
    chiron_destroy(ctx);
    if (!ok) return EXIT_FAILURE;
    puts("FINAL_API_OWNED_KEY_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Capacidade, key e outbox": [
    { lang: "c", purpose: "Modelo atômico local reproduz replay/conflito e grava outbox uma vez; banco real continua gate separado.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct state { int remaining, outbox; char key[8], fingerprint[8]; };
enum outcome { MADE, REPLAY, CONFLICT, SOLD_OUT };
static enum outcome apply(struct state *s, const char *key, const char *fp) {
    if (s->key[0]) return !strcmp(s->key,key) && !strcmp(s->fingerprint,fp) ? REPLAY : CONFLICT;
    if (s->remaining < 1) return SOLD_OUT;
    strcpy(s->key,key); strcpy(s->fingerprint,fp);
    --s->remaining; ++s->outbox;
    return MADE;
}

int main(void) {
    struct state s = {1,0,{0},{0}};
    if (apply(&s,"k1","f1") != MADE || apply(&s,"k1","f1") != REPLAY ||
        apply(&s,"k1","f2") != CONFLICT || s.remaining || s.outbox != 1)
        return EXIT_FAILURE;
    puts("CAPACITY_KEY_OUTBOX_MODEL_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Fencing local impede owner antigo de ack após generation mudar; SQL claim real é gate pendente.", code: `#include <stdio.h>
#include <stdlib.h>

struct event { unsigned generation; int sent; };
static int acknowledge(struct event *e, unsigned owner_generation) {
    if (!e || e->sent || owner_generation != e->generation) return 0;
    e->sent = 1;
    return 1;
}

int main(void) {
    struct event e = {1,0};
    unsigned stale_owner = 1;
    e.generation = 2; /* lease reatribuída */
    if (acknowledge(&e, stale_owner) || e.sent) return EXIT_FAILURE;
    if (!acknowledge(&e, 2) || !e.sent) return EXIT_FAILURE;
    puts("FENCING_MODEL_REJECTS_STALE_OWNER_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Segurança, fuzz e carga": [
    { lang: "c", purpose: "Mini corpus adversarial prova que parser rejeita NUL/formato/length sem mover out.", code: `#include <stddef.h>
#include <stdio.h>
#include <stdlib.h>

static int parse_key(const unsigned char *p, size_t n, unsigned *out) {
    if (!p || !out || n == 0 || n > 8) return 0;
    for (size_t i = 0; i < n; ++i)
        if (!((p[i] >= 'a' && p[i] <= 'z') || (p[i] >= '0' && p[i] <= '9')))
            return 0;
    *out = (unsigned)n;
    return 1;
}

int main(void) {
    const unsigned char corpus[][3] = {{'a',0,'b'},{'%','n',0},{'.','.', '/'}};
    for (size_t i = 0; i < 3; ++i) {
        unsigned out = 77;
        if (parse_key(corpus[i], 3, &out) || out != 77) return EXIT_FAILURE;
    }
    unsigned out = 0;
    if (!parse_key((const unsigned char *)"k41", 3, &out) || out != 3)
        return EXIT_FAILURE;
    puts("ADVERSARIAL_CORPUS_ORACLE_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Carga determinística mantém memória bounded e um efeito para retries da mesma key.", code: `#include <stdio.h>
#include <stdlib.h>

struct load_state { int remaining, effects, replays; };
static int request(struct load_state *s, int same_key) {
    if (same_key && s->effects) { ++s->replays; return 1; }
    if (s->remaining <= 0) return 0;
    --s->remaining; ++s->effects;
    return 1;
}

int main(void) {
    struct load_state s = {1,0,0};
    for (int i = 0; i < 10000; ++i)
        if (!request(&s, 1)) return EXIT_FAILURE;
    if (s.remaining != 0 || s.effects != 1 || s.replays != 9999)
        return EXIT_FAILURE;
    puts("LOAD_ORACLE_EFFECT_ONCE_MODEL_OK");
    return EXIT_SUCCESS;
}` },
  ],
  "Banca, deploy e restore": [
    { lang: "c", purpose: "Banca agregada local verifica última vaga, replay, conflito e outbox; integrações externas continuam separadas.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct model { int remaining, reservations, outbox; char key[8], fp[8]; };
static int reserve(struct model *m, const char *key, const char *fp) {
    if (m->key[0]) return !strcmp(m->key,key) && !strcmp(m->fp,fp) ? 2 : -1;
    if (!m->remaining) return 0;
    strcpy(m->key,key); strcpy(m->fp,fp);
    --m->remaining; ++m->reservations; ++m->outbox;
    return 1;
}

int main(void) {
    struct model m = {1,0,0,{0},{0}};
    if (reserve(&m,"k1","f1") != 1 || reserve(&m,"k1","f1") != 2 ||
        reserve(&m,"k1","other") != -1 || reserve(&m,"k2","f2") != -1 ||
        m.remaining || m.reservations != 1 || m.outbox != 1)
        return EXIT_FAILURE;
    puts("FINAL_LOCAL_BOARD_MODEL_OK");
    return EXIT_SUCCESS;
}` },
    { lang: "c", purpose: "Restore valida manifesto completo e reprocessa pending com mesmo eventId sem duplicar fake remoto.", code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

struct restored { int keys, reservations, outbox; char event[8]; int remote_effects; };
static int replay(struct restored *r, const char *event) {
    if (!r || !r->keys || !r->reservations || !r->outbox || strcmp(r->event,event))
        return 0;
    if (!r->remote_effects) r->remote_effects = 1;
    return 1;
}

int main(void) {
    struct restored r = {1,1,1,"evt41",0};
    if (!replay(&r,"evt41") || !replay(&r,"evt41") || r.remote_effects != 1)
        return EXIT_FAILURE;
    r.keys = 0;
    if (replay(&r,"evt41")) return EXIT_FAILURE;
    puts("FINAL_RESTORE_REPLAY_MODEL_OK");
    return EXIT_SUCCESS;
}` },
  ],
};
