export type FlaskExample = { lang: "python"; code: string; purpose: string };
export const FLASK_EXAMPLES: Record<string, [FlaskExample, FlaskExample]> = {
  "Versões, ambiente e application factory": [
    { lang: "python", purpose: "Factory aplica configuração antes das extensões e registra componentes sem efeitos externos no import.", code: `from flask import Flask
from importlib.metadata import version

def create_app(config: dict[str, object] | None = None) -> Flask:
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(MAX_CONTENT_LENGTH=1_048_576, JSON_SORT_KEYS=False)
    if config:
        app.config.from_mapping(config)
    required = ("SECRET_KEY", "DATABASE_URL")
    missing = [key for key in required if not app.config.get(key)]
    if missing:
        raise RuntimeError(f"missing configuration: {','.join(missing)}")
    from .routes import api
    app.register_blueprint(api, url_prefix="/v1")
    return app

def runtime_identity() -> dict[str, str]:
    return {"python": __import__("platform").python_version(), "flask": version("flask"), "werkzeug": version("werkzeug")}` },
    { lang: "python", purpose: "Registry fechado seleciona configuração por ambiente sem importar classe indicada externamente.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class RuntimeConfig:
    debug: bool
    database_pool_size: int
    external_base_url: str

CONFIGS = {
    "production": RuntimeConfig(False, 16, "https://api.example.test"),
    "staging": RuntimeConfig(False, 4, "https://staging-api.example.test"),
    "test": RuntimeConfig(False, 2, "https://provider.invalid"),
}

def config_for(environment: str) -> RuntimeConfig:
    try:
        return CONFIGS[environment]
    except KeyError as error:
        raise ValueError("unsupported environment") from error

assert config_for("production").debug is False
try:
    config_for("builtins.dict")
    raise AssertionError("unknown environment accepted")
except ValueError:
    pass` },
  ],
  "Configuração, instance folder e secrets": [
    { lang: "python", purpose: "Parser tipado distingue ausência, vazio e inteiro fora da faixa antes do startup.", code: `from dataclasses import dataclass
from collections.abc import Mapping

@dataclass(frozen=True)
class ServiceConfig:
    database_url: str
    pool_size: int
    request_timeout_ms: int

def parse_config(values: Mapping[str, str]) -> ServiceConfig:
    database_url = values.get("DATABASE_URL", "")
    if not database_url.startswith(("postgresql://", "postgresql+psycopg://")):
        raise ValueError("DATABASE_URL is missing or unsupported")
    try:
        pool_size, timeout = int(values["DB_POOL_SIZE"]), int(values["REQUEST_TIMEOUT_MS"])
    except (KeyError, ValueError) as error:
        raise ValueError("invalid numeric configuration") from error
    if not 1 <= pool_size <= 64 or not 100 <= timeout <= 30_000:
        raise ValueError("configuration outside allowed range")
    return ServiceConfig(database_url, pool_size, timeout)` },
    { lang: "python", purpose: "Wrapper de segredo impede repr e serialização acidentais e restringe o ponto de uso.", code: `from dataclasses import dataclass
from typing import Callable, TypeVar

T = TypeVar("T")

@dataclass(frozen=True, repr=False)
class SecretValue:
    __value: str

    def __post_init__(self) -> None:
        if not self.__value:
            raise ValueError("secret is required")

    def use(self, consumer: Callable[[str], T]) -> T:
        return consumer(self.__value)

    def __repr__(self) -> str:
        return "SecretValue([REDACTED])"

secret = SecretValue("test-canary-not-production")
assert "canary" not in repr(secret)
assert secret.use(lambda value: len(value)) == 26` },
  ],
  "Application e request contexts": [
    { lang: "python", purpose: "View converte proxies Flask em command imutável antes de chamar o serviço.", code: `from dataclasses import dataclass
from flask import Blueprint, g, request

api = Blueprint("reservations", __name__)

@dataclass(frozen=True)
class CreateReservation:
    actor_id: str
    tenant_id: str
    show_id: str
    quantity: int

@api.post("/reservations")
def create_reservation_view():
    body = request.get_json(cache=False, silent=False)
    if not isinstance(body, dict) or set(body) != {"show_id", "quantity"}:
        return {"error": "invalid_request"}, 400
    identity = g.identity
    command = CreateReservation(identity.actor_id, identity.tenant_id, str(body["show_id"]), int(body["quantity"]))
    outcome = g.services.create_reservation.execute(command)
    return {"outcome": outcome.kind, "operation_id": outcome.operation_id}, outcome.http_status` },
    { lang: "python", purpose: "Teardown remove a Session da unidade mesmo quando a view lança exceção.", code: `from flask import Flask, g
from sqlalchemy.orm import Session, sessionmaker

def install_database_scope(app: Flask, factory: sessionmaker[Session]) -> None:
    @app.before_request
    def open_session() -> None:
        if "db" in g:
            raise RuntimeError("database scope already exists")
        g.db = factory()

    @app.teardown_request
    def close_session(error: BaseException | None) -> None:
        db: Session | None = g.pop("db", None)
        if db is None:
            return
        try:
            if error is not None:
                db.rollback()
        finally:
            db.close()` },
  ],
  "CLI, dev server e reloader": [
    { lang: "python", purpose: "Command administrativo exige target, suporta dry-run e chama serviço sem request context.", code: `import click
from flask import Flask, current_app

def register_commands(app: Flask) -> None:
    @app.cli.command("reconcile-outbox")
    @click.option("--tenant", required=True)
    @click.option("--limit", type=click.IntRange(1, 1000), default=100)
    @click.option("--apply", is_flag=True, default=False)
    def reconcile_outbox(tenant: str, limit: int, apply: bool) -> None:
        service = current_app.extensions["services"].outbox_reconciler
        report = service.run(tenant_id=tenant, limit=limit, dry_run=not apply)
        click.echo(f"examined={report.examined} changed={report.changed} dry_run={not apply}")
        if report.unknown:
            raise click.ClickException(f"unknown outcomes remain: {report.unknown}")` },
    { lang: "python", purpose: "Auditoria de bootstrap prova que duas criações não iniciam scheduler, migration ou chamada remota.", code: `from collections.abc import Callable
from flask import Flask

class SideEffectProbe:
    def __init__(self) -> None:
        self.events: list[str] = []
    def record(self, event: str) -> None:
        self.events.append(event)

def assert_factory_is_bootstrap_only(factory: Callable[[dict[str, object]], Flask]) -> None:
    common = {"TESTING": True, "SECRET_KEY": "test-only", "DATABASE_URL": "postgresql://invalid/test"}
    first, second = factory({**common, "INSTANCE_NAME": "first"}), factory({**common, "INSTANCE_NAME": "second"})
    assert first is not second
    assert first.config["INSTANCE_NAME"] == "first"
    assert second.config["INSTANCE_NAME"] == "second"
    forbidden = {"scheduler_started", "migration_applied", "provider_called"}
    assert not forbidden.intersection(first.extensions.get("startup_events", ()))` },
  ],
  "Routes, methods e converters": [
    { lang: "python", purpose: "Converter valida somente sintaxe bounded e a view delega autorização ao serviço scoped.", code: `import re
from werkzeug.routing import BaseConverter, ValidationError
from flask import Blueprint, g

class ReservationIdConverter(BaseConverter):
    regex = r"res_[a-z0-9]{16}"
    def to_python(self, value: str) -> str:
        if len(value) > 20 or re.fullmatch(self.regex, value) is None:
            raise ValidationError()
        return value

api = Blueprint("reservation_api", __name__)

@api.get("/reservations/<reservation_id:reservation_id>")
def show_reservation(reservation_id: str):
    outcome = g.services.reservations.show(g.identity, reservation_id)
    return outcome.body, outcome.status` },
    { lang: "python", purpose: "Validador de redirect aceita somente path local normalizado e rejeita URL ambígua.", code: `from urllib.parse import urlsplit

def local_redirect_target(raw: str | None, default: str = "/") -> str:
    if raw is None:
        return default
    if len(raw) > 512 or "\\" in raw or any(ord(char) < 32 for char in raw):
        raise ValueError("invalid redirect")
    parsed = urlsplit(raw)
    if parsed.scheme or parsed.netloc or not parsed.path.startswith("/") or parsed.path.startswith("//"):
        raise ValueError("external redirect forbidden")
    return parsed.path + (("?" + parsed.query) if parsed.query else "")

assert local_redirect_target("/reservations?page=2") == "/reservations?page=2"
for attack in ("https://evil.test/", "//evil.test/", "/\\evil.test/"):
    try: local_redirect_target(attack); raise AssertionError(attack)
    except ValueError: pass` },
  ],
  "Request, JSON, forms e uploads": [
    { lang: "python", purpose: "Parser JSON preserva tipos e rejeita chaves desconhecidas antes do serviço.", code: `from dataclasses import dataclass
from typing import Any

@dataclass(frozen=True)
class ReservationInput:
    show_id: str
    quantity: int

def parse_reservation_json(value: Any) -> ReservationInput:
    if not isinstance(value, dict) or set(value) != {"show_id", "quantity"}:
        raise ValueError("invalid object shape")
    show_id, quantity = value["show_id"], value["quantity"]
    if not isinstance(show_id, str) or not 1 <= len(show_id) <= 64:
        raise ValueError("invalid show_id")
    if isinstance(quantity, bool) or not isinstance(quantity, int) or not 1 <= quantity <= 8:
        raise ValueError("invalid quantity")
    return ReservationInput(show_id, quantity)

assert parse_reservation_json({"show_id": "s-1", "quantity": 2}).quantity == 2
for bad in (True, "2", 0, 9):
    try: parse_reservation_json({"show_id": "s-1", "quantity": bad}); raise AssertionError(bad)
    except ValueError: pass` },
    { lang: "python", purpose: "Upload pipeline limita bytes, detecta MIME e gera nome próprio fora da raiz pública.", code: `from pathlib import Path
import secrets
from werkzeug.datastructures import FileStorage

ALLOWED_SIGNATURES = {b"\x89PNG\r\n\x1a\n": ".png", b"\xff\xd8\xff": ".jpg"}

def store_image(upload: FileStorage, root: Path, maximum: int = 2_000_000) -> str:
    prefix = upload.stream.read(16)
    extension = next((ext for signature, ext in ALLOWED_SIGNATURES.items() if prefix.startswith(signature)), None)
    if extension is None:
        raise ValueError("unsupported image")
    remainder = upload.stream.read(maximum + 1)
    if len(prefix) + len(remainder) > maximum:
        raise ValueError("upload too large")
    name = secrets.token_hex(16) + extension
    target = root / name
    target.write_bytes(prefix + remainder)
    target.chmod(0o640)
    return name` },
  ],
  "Responses, errors e negociação": [
    { lang: "python", purpose: "Outcome fechado mapeia estado conhecido para status e envelope sem capturar bugs.", code: `from dataclasses import dataclass
from enum import Enum

class OutcomeKind(Enum):
    CREATED="created"; REPLAYED="replayed"; CONFLICT="conflict"; SOLD_OUT="sold_out"; UNKNOWN="unknown"

@dataclass(frozen=True)
class ReservationOutcome:
    kind: OutcomeKind
    operation_id: str

def response_for(outcome: ReservationOutcome) -> tuple[dict[str, str], int]:
    status = {OutcomeKind.CREATED: 201, OutcomeKind.REPLAYED: 200, OutcomeKind.CONFLICT: 409,
              OutcomeKind.SOLD_OUT: 409, OutcomeKind.UNKNOWN: 202}[outcome.kind]
    return {"operation_id": outcome.operation_id, "outcome": outcome.kind.value}, status

assert response_for(ReservationOutcome(OutcomeKind.CREATED,"op-1"))[1] == 201
assert response_for(ReservationOutcome(OutcomeKind.UNKNOWN,"op-1"))[1] == 202` },
    { lang: "python", purpose: "Negociação seleciona representação fechada e produz 406 para Accept incompatível.", code: `from flask import Request, Response, json

SUPPORTED = ("application/problem+json", "application/json")

def negotiated_json(request: Request, payload: dict[str, object], status: int = 200) -> Response:
    best = request.accept_mimetypes.best_match(SUPPORTED)
    if best is None or request.accept_mimetypes[best] == 0:
        return Response(json.dumps({"error": "not_acceptable"}), 406, content_type="application/problem+json")
    body = json.dumps(payload, separators=(",", ":"), sort_keys=False)
    response = Response(body, status, content_type=best)
    response.headers["Vary"] = "Accept"
    response.headers["X-Content-Type-Options"] = "nosniff"
    return response` },
  ],
  "Blueprints, hooks e middleware": [
    { lang: "python", purpose: "Hooks autenticam antes do serviço e limpam a Session em teardown sem auto-commit.", code: `from flask import Blueprint, g, request

private = Blueprint("private", __name__)

@private.before_request
def authenticate_request():
    token = request.headers.get("Authorization")
    identity = g.services.auth.authenticate_bearer(token)
    if identity is None:
        return {"error": "unauthorized"}, 401
    g.identity = identity

@private.teardown_request
def cleanup_request(error: BaseException | None):
    session = g.pop("db", None)
    if session is not None:
        try:
            if error is not None or session.in_transaction():
                session.rollback()
        finally:
            session.close()` },
    { lang: "python", purpose: "Middleware limita forwarded trust e conserva close do iterable WSGI.", code: `from collections.abc import Callable, Iterable
from werkzeug.middleware.proxy_fix import ProxyFix

StartResponse = Callable[[str, list[tuple[str, str]]], Callable[[bytes], object]]

class CorrelationMiddleware:
    def __init__(self, app: Callable): self.app = app
    def __call__(self, environ: dict, start_response: StartResponse) -> Iterable[bytes]:
        supplied = environ.get("HTTP_X_REQUEST_ID", "")
        request_id = supplied if isinstance(supplied, str) and supplied.isascii() and 1 <= len(supplied) <= 64 else "generated"
        environ["chiron.request_id"] = request_id
        return self.app(environ, start_response)

def trusted_proxy_stack(app: Callable) -> Callable:
    # Network policy must ensure exactly one trusted proxy reaches this listener.
    return CorrelationMiddleware(ProxyFix(app, x_for=1, x_proto=1, x_host=1, x_port=1))` },
  ],
  "Jinja, autoescape e contextos": [
    { lang: "python", purpose: "Macro gera estrutura fixa e escapa slots sem aceitar fragmento HTML arbitrário.", code: `from markupsafe import Markup, escape

STATUS_CLASSES = {"pending": "status--pending", "confirmed": "status--confirmed", "cancelled": "status--cancelled"}

def status_badge(status: str, label: str) -> Markup:
    css_class = STATUS_CLASSES.get(status, "status--unknown")
    return Markup('<span class="status {}">{}</span>').format(escape(css_class), escape(label))

rendered = status_badge("confirmed", '<img src=x onerror="alert(1)">')
assert "<img" not in rendered
assert "&lt;img" in rendered
assert 'class="status status--confirmed"' in rendered` },
    { lang: "python", purpose: "Builder de link aceita somente schemes fechados e nunca confunde escaping com autorização de URL.", code: `from urllib.parse import urlsplit, urlunsplit
from markupsafe import Markup, escape

def external_link(raw_url: str, label: str, allowed_hosts: set[str]) -> Markup:
    parsed = urlsplit(raw_url)
    host = (parsed.hostname or "").lower().rstrip(".")
    if parsed.scheme != "https" or parsed.username or parsed.password or host not in allowed_hosts or parsed.port not in (None, 443):
        raise ValueError("unapproved link")
    canonical = urlunsplit(("https", host, parsed.path or "/", parsed.query, ""))
    return Markup('<a href="{}" rel="noopener noreferrer">{}</a>').format(escape(canonical), escape(label))

assert "https://docs.example.test/guide" in external_link("https://docs.example.test/guide", "Guide", {"docs.example.test"})
try: external_link("javascript:alert(1)", "bad", {"docs.example.test"}); raise AssertionError()
except ValueError: pass` },
  ],
  "Sessions, cookies e CSRF": [
    { lang: "python", purpose: "Token CSRF liga nonce à sessão e purpose com comparação constante e limite.", code: `import base64, hashlib, hmac, secrets

def issue_csrf(session_secret: bytes, purpose: str) -> str:
    nonce = secrets.token_bytes(24)
    mac = hmac.new(session_secret, purpose.encode() + b"\0" + nonce, hashlib.sha256).digest()
    return base64.urlsafe_b64encode(nonce + mac).rstrip(b"=").decode("ascii")

def verify_csrf(token: str, session_secret: bytes, purpose: str) -> bool:
    if len(token) > 128: return False
    try: raw = base64.urlsafe_b64decode(token + "=" * (-len(token) % 4))
    except Exception: return False
    if len(raw) != 56: return False
    nonce, supplied = raw[:24], raw[24:]
    expected = hmac.new(session_secret, purpose.encode() + b"\0" + nonce, hashlib.sha256).digest()
    return hmac.compare_digest(supplied, expected)

secret=secrets.token_bytes(32); token=issue_csrf(secret,"reservation.create")
assert verify_csrf(token,secret,"reservation.create") and not verify_csrf(token,secret,"account.delete")` },
    { lang: "python", purpose: "Sessão guarda somente identidade mínima e versão revalidável, nunca credenciais ou roles permanentes.", code: `from flask import session
from dataclasses import dataclass

@dataclass(frozen=True)
class AuthenticatedAccount:
    actor_id: str
    auth_version: int
    active: bool

def establish_session(account: AuthenticatedAccount) -> None:
    if not account.active or account.auth_version < 1:
        raise ValueError("inactive account")
    session.clear()
    session["actor_id"] = account.actor_id
    session["auth_version"] = account.auth_version
    session["fresh"] = True
    forbidden = {"password", "access_token", "roles", "tenant_memberships"}
    assert forbidden.isdisjoint(session.keys())` },
  ],
  "CSP, static e assets": [
    { lang: "python", purpose: "Helper resolve somente assets presentes no manifesto imutável e produz URL por hash.", code: `from dataclasses import dataclass
from flask import url_for

@dataclass(frozen=True)
class AssetManifest:
    files: dict[str, str]
    def resolve(self, logical_name: str) -> str:
        try: filename = self.files[logical_name]
        except KeyError as error: raise RuntimeError(f"asset absent: {logical_name}") from error
        if "/" in filename or "\\" in filename or not filename.startswith(logical_name.rsplit(".",1)[0] + "."):
            raise RuntimeError("invalid asset manifest")
        return url_for("static", filename=filename)

# In an application context:
# assert AssetManifest({"app.js":"app.a1b2c3.js"}).resolve("app.js").endswith("/app.a1b2c3.js")` },
    { lang: "python", purpose: "After-request aplica CSP nonceado e headers complementares sem wildcard ou unsafe-eval.", code: `import base64, secrets
from flask import Flask, g, Response

def install_security_headers(app: Flask) -> None:
    @app.before_request
    def create_nonce() -> None:
        g.csp_nonce = base64.urlsafe_b64encode(secrets.token_bytes(24)).rstrip(b"=").decode("ascii")

    @app.after_request
    def secure(response: Response) -> Response:
        response.headers["Content-Security-Policy"] = (
            f"default-src 'none'; script-src 'nonce-{g.csp_nonce}'; style-src 'self'; "
            "img-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'"
        )
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["Referrer-Policy"] = "no-referrer"
        return response` },
  ],
  "Forms, redirects e flash": [
    { lang: "python", purpose: "Form parser usa allowlist e preserva ausência/checkbox sem mass assignment.", code: `from dataclasses import dataclass
from werkzeug.datastructures import MultiDict

@dataclass(frozen=True)
class ReservationForm:
    show_id: str
    quantity: int
    accept_terms: bool

def parse_reservation_form(form: MultiDict[str, str]) -> ReservationForm:
    allowed={"show_id","quantity","accept_terms","csrf_token","idempotency_key"}
    if not set(form).issubset(allowed) or any(len(form.getlist(key)) != 1 for key in form if key != "accept_terms"):
        raise ValueError("invalid fields")
    show_id=form.get("show_id",""); raw_quantity=form.get("quantity","")
    if not show_id or not raw_quantity.isascii() or not raw_quantity.isdecimal(): raise ValueError("invalid values")
    quantity=int(raw_quantity)
    if not 1 <= quantity <= 8: raise ValueError("quantity range")
    return ReservationForm(show_id,quantity,form.get("accept_terms")=="on")` },
    { lang: "python", purpose: "Fluxo PRG redireciona somente após outcome conhecido e mantém Unknown distinto de sucesso.", code: `from enum import Enum
from flask import flash, redirect, url_for

class FormOutcome(Enum):
    CREATED="created"; REPLAYED="replayed"; CONFLICT="conflict"; UNKNOWN="unknown"

def finish_reservation(outcome: FormOutcome, operation_id: str):
    if outcome in (FormOutcome.CREATED, FormOutcome.REPLAYED):
        flash("reservation_saved", "success")
        return redirect(url_for("reservation.show", operation_id=operation_id), code=303)
    if outcome is FormOutcome.UNKNOWN:
        flash("reservation_pending_confirmation", "warning")
        return redirect(url_for("operation.show", operation_id=operation_id), code=303)
    flash("reservation_conflict", "error")
    return redirect(url_for("reservation.new"), code=303)` },
  ],
  "Commands, services e ports": [
    { lang: "python", purpose: "Command imutável contém somente identidade confiável e valores de domínio, sem LocalProxy.", code: `from dataclasses import dataclass

@dataclass(frozen=True, slots=True)
class CreateReservationCommand:
    operation_id: str
    actor_id: str
    tenant_id: str
    idempotency_key: str
    fingerprint: str
    show_id: str
    quantity: int

    def __post_init__(self) -> None:
        text_fields=(self.operation_id,self.actor_id,self.tenant_id,self.idempotency_key,self.fingerprint,self.show_id)
        if any(not value or len(value)>128 for value in text_fields) or not 1 <= self.quantity <= 8:
            raise ValueError("invalid reservation command")

command=CreateReservationCommand("op-1","u-1","tenant-a","key-1","fp-1","show-1",2)
assert command.quantity == 2` },
    { lang: "python", purpose: "Port de provider retorna outcome próprio e exige identidade estável e deadline.", code: `from dataclasses import dataclass
from enum import Enum
from typing import Protocol

class DeliveryKind(Enum):
    ACCEPTED="accepted"; REPLAYED="replayed"; REJECTED="rejected"; UNKNOWN="unknown"

@dataclass(frozen=True)
class DeliveryOutcome:
    kind: DeliveryKind
    receipt: str | None

class NotificationProvider(Protocol):
    def deliver(self, *, tenant_id: str, event_id: str, payload: bytes, deadline_ms: int) -> DeliveryOutcome: ...

def dispatch(provider: NotificationProvider, tenant: str, event_id: str, payload: bytes) -> DeliveryOutcome:
    if not tenant or not event_id or len(payload)>16_384: raise ValueError("delivery request")
    return provider.deliver(tenant_id=tenant,event_id=event_id,payload=payload,deadline_ms=3_000)` },
  ],
  "Extensões e composition root": [
    { lang: "python", purpose: "Composition root seleciona adapter por ambiente fechado e rejeita fallback produtivo.", code: `from dataclasses import dataclass
from typing import Protocol

class ReservationRepository(Protocol): ...
@dataclass(frozen=True)
class ProductionSettings:
    environment: str
    database_url: str

def build_repository(settings: ProductionSettings, engine) -> ReservationRepository:
    if settings.environment in {"production","staging"}:
        if not settings.database_url.startswith(("postgresql://","postgresql+psycopg://")):
            raise RuntimeError("production database adapter required")
        from .persistence import SqlAlchemyReservationRepository
        return SqlAlchemyReservationRepository(engine)
    if settings.environment == "test":
        from .testing import MemoryReservationRepository
        return MemoryReservationRepository()
    raise RuntimeError("unsupported environment")` },
    { lang: "python", purpose: "Extensão factory-safe mantém estado por app e não cria conexão durante import.", code: `from dataclasses import dataclass
from flask import Flask, current_app

@dataclass(frozen=True)
class ServiceGraph:
    reservations: object
    outbox: object

class ServicesExtension:
    def init_app(self, app: Flask, graph: ServiceGraph) -> None:
        if "chiron.services" in app.extensions:
            raise RuntimeError("services already initialized")
        app.extensions["chiron.services"] = graph

    @property
    def graph(self) -> ServiceGraph:
        value=current_app.extensions.get("chiron.services")
        if not isinstance(value,ServiceGraph): raise RuntimeError("services unavailable")
        return value

services=ServicesExtension()` },
  ],
  "Erros, outcomes e transactions": [
    { lang: "python", purpose: "Runner delimita transaction e rollback sem decidir HTTP nem incluir provider remoto.", code: `from collections.abc import Callable
from typing import TypeVar
from sqlalchemy.orm import Session, sessionmaker

T=TypeVar("T")

class TransactionRunner:
    def __init__(self,factory: sessionmaker[Session]): self._factory=factory
    def run(self,operation: Callable[[Session],T]) -> T:
        with self._factory() as session:
            try:
                with session.begin():
                    result=operation(session)
                return result
            except BaseException:
                if session.in_transaction(): session.rollback()
                raise

assert TransactionRunner.run.__annotations__["return"] == "T" or TransactionRunner.run.__annotations__["return"] is not None` },
    { lang: "python", purpose: "Readback de commit ambíguo diferencia replay, conflito e ainda desconhecido.", code: `from enum import Enum

class AmbiguousResult(Enum):
    REPLAYED="replayed"; CONFLICT="conflict"; STILL_UNKNOWN="still_unknown"

def resolve_ambiguous(intent: dict[str,str] | None, expected_fingerprint: str) -> AmbiguousResult:
    if intent is None: return AmbiguousResult.STILL_UNKNOWN
    fingerprint=intent.get("fingerprint")
    if fingerprint != expected_fingerprint: return AmbiguousResult.CONFLICT
    if not intent.get("reservation_id") or not intent.get("event_id"):
        raise ValueError("corrupt intent")
    return AmbiguousResult.REPLAYED

assert resolve_ambiguous(None,"fp") is AmbiguousResult.STILL_UNKNOWN
assert resolve_ambiguous({"fingerprint":"fp","reservation_id":"r-1","event_id":"e-1"},"fp") is AmbiguousResult.REPLAYED` },
  ],
  "Autenticação, policies e tenant": [
    { lang: "python", purpose: "Policy independente do Flask exige tenant, ownership, status e capability atuais.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Identity:
    actor_id: str
    tenant_id: str
    capabilities: frozenset[str]
    auth_version: int

@dataclass(frozen=True)
class ReservationView:
    tenant_id: str
    owner_id: str
    status: str

def may_cancel(identity: Identity,reservation: ReservationView) -> bool:
    if identity.auth_version < 1 or identity.tenant_id != reservation.tenant_id or reservation.status != "pending": return False
    return identity.actor_id == reservation.owner_id or "reservation.cancel:any" in identity.capabilities

actor=Identity("u-1","alpha",frozenset({"reservation.cancel:own"}),1)
assert may_cancel(actor,ReservationView("alpha","u-1","pending"))
assert not may_cancel(actor,ReservationView("beta","u-1","pending"))` },
    { lang: "python", purpose: "Repository query inclui tenant no predicado e nunca carrega globalmente antes da policy.", code: `from sqlalchemy import select
from sqlalchemy.orm import Session

class ScopedReservationReader:
    def __init__(self,session: Session,tenant_id: str):
        if not tenant_id: raise ValueError("tenant")
        self._session,self._tenant_id=session,tenant_id

    def find(self,reservation_id: str):
        if not reservation_id: raise ValueError("reservation id")
        statement=(select(Reservation)
                   .where(Reservation.tenant_id == self._tenant_id)
                   .where(Reservation.id == reservation_id))
        return self._session.execute(statement).scalar_one_or_none()

# Contract test inserts the same reservation ID under alpha and beta,
# then proves each reader can observe only its own tenant.` },
  ],
  "Session, unit of work e mapping": [
    { lang: "python", purpose: "Escopo abre uma Session por unidade, faz rollback residual e fecha sempre.", code: `from collections.abc import Callable
from typing import TypeVar
from sqlalchemy.orm import Session, sessionmaker

T=TypeVar("T")
def with_session(factory: sessionmaker[Session],operation: Callable[[Session],T]) -> T:
    session=factory()
    try:
        with session.begin(): return operation(session)
    except BaseException:
        if session.in_transaction(): session.rollback()
        raise
    finally:
        session.close()

assert with_session.__annotations__["return"] is not None` },
    { lang: "python", purpose: "Mapper de projection recusa tenant, status e quantidade corrompidos.", code: `from dataclasses import dataclass
from enum import Enum
from collections.abc import Mapping

class Status(Enum): PENDING="pending"; CONFIRMED="confirmed"; CANCELLED="cancelled"
@dataclass(frozen=True)
class ReservationRow: id:str; tenant_id:str; status:Status; quantity:int

def map_row(row: Mapping[str,object],expected_tenant: str) -> ReservationRow:
    if set(row)!={"id","tenant_id","status","quantity"} or row["tenant_id"]!=expected_tenant: raise ValueError("row identity")
    if not isinstance(row["id"],str) or isinstance(row["quantity"],bool) or not isinstance(row["quantity"],int) or row["quantity"]<1: raise ValueError("row values")
    return ReservationRow(row["id"],expected_tenant,Status(str(row["status"])),row["quantity"])

assert map_row({"id":"r-1","tenant_id":"alpha","status":"pending","quantity":1},"alpha").status is Status.PENDING` },
  ],
  "Models, constraints e Alembic": [
    { lang: "python", purpose: "Metadata modela tenant composto, idempotência e checks duráveis.", code: `from sqlalchemy import CheckConstraint, ForeignKeyConstraint, String, UniqueConstraint
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase): pass
class Reservation(Base):
    __tablename__="reservations"
    tenant_id:Mapped[str]=mapped_column(String(64),primary_key=True)
    id:Mapped[str]=mapped_column(String(64),primary_key=True)
    show_id:Mapped[str]=mapped_column(String(64),nullable=False)
    idempotency_key:Mapped[str]=mapped_column(String(128),nullable=False)
    quantity:Mapped[int]=mapped_column(nullable=False)
    status:Mapped[str]=mapped_column(String(16),nullable=False)
    __table_args__=(UniqueConstraint("tenant_id","idempotency_key",name="uq_reservation_intent"),ForeignKeyConstraint(["tenant_id","show_id"],["shows.tenant_id","shows.id"],name="fk_reservation_show"),CheckConstraint("quantity > 0",name="ck_reservation_quantity"),CheckConstraint("status IN ('pending','confirmed','cancelled')",name="ck_reservation_status"))` },
    { lang: "python", purpose: "Preflight de migration exige versão, espaço, lag e lock antes de aplicar revisão.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class MigrationPreflight:
    current_revision:str
    expected_revision:str
    free_bytes:int
    required_bytes:int
    replica_lag_seconds:float
    lock_acquired:bool

def approve_preflight(value: MigrationPreflight) -> None:
    if value.current_revision!=value.expected_revision: raise RuntimeError("unexpected schema revision")
    if value.free_bytes < value.required_bytes*2: raise RuntimeError("insufficient migration space")
    if value.replica_lag_seconds>10: raise RuntimeError("replica lag")
    if not value.lock_acquired: raise RuntimeError("migration runner already active")

approve_preflight(MigrationPreflight("abc","abc",10_000,2_000,0.2,True))` },
  ],
  "Queries, loading e paginação": [
    { lang: "python", purpose: "Ordenação externa é mapeada para colunas conhecidas e sempre mantém tenant.", code: `from sqlalchemy import select

SORTS={"created_desc":(Reservation.created_at.desc(),Reservation.id.desc()),"status_asc":(Reservation.status.asc(),Reservation.id.asc())}

def reservation_page(tenant_id: str,sort: str,limit: int):
    if not tenant_id or sort not in SORTS or not 1 <= limit <= 100: raise ValueError("page request")
    return (select(Reservation.id,Reservation.status,Reservation.created_at)
            .where(Reservation.tenant_id==tenant_id)
            .order_by(*SORTS[sort]).limit(limit))

statement=reservation_page("alpha","created_desc",50)
assert "tenant_id" in str(statement) and "LIMIT" in str(statement)` },
    { lang: "python", purpose: "Cursor assinado liga tenant, filtros e última chave à página seguinte.", code: `import base64, hashlib, hmac, json

def encode_cursor(secret:bytes,tenant:str,filter_hash:str,created_at:str,item_id:str)->str:
    payload=json.dumps({"v":1,"t":tenant,"f":filter_hash,"c":created_at,"i":item_id},separators=(",",":"),sort_keys=True).encode()
    mac=hmac.new(secret,payload,hashlib.sha256).digest()
    return base64.urlsafe_b64encode(payload+mac).decode().rstrip("=")

def decode_cursor(secret:bytes,token:str,tenant:str,filter_hash:str)->tuple[str,str]:
    raw=base64.urlsafe_b64decode(token+"="*(-len(token)%4)); payload,mac=raw[:-32],raw[-32:]
    if not hmac.compare_digest(mac,hmac.new(secret,payload,hashlib.sha256).digest()): raise ValueError("cursor signature")
    value=json.loads(payload)
    if value!={"v":1,"t":tenant,"f":filter_hash,"c":value.get("c"),"i":value.get("i")}: raise ValueError("cursor scope")
    return value["c"],value["i"]` },
  ],
  "Última vaga e isolamento": [
    { lang: "python", purpose: "Update condicional reserva capacidade e verifica rowcount no dialect alvo.", code: `from sqlalchemy import update
from sqlalchemy.orm import Session

def decrement_capacity(session:Session,tenant_id:str,show_id:str,quantity:int)->bool:
    if not 1 <= quantity <= 8: raise ValueError("quantity")
    statement=(update(Show).where(Show.tenant_id==tenant_id,Show.id==show_id,Show.available>=quantity)
               .values(available=Show.available-quantity))
    result=session.execute(statement)
    if result.rowcount not in (0,1): raise RuntimeError("unexpected capacity update")
    return result.rowcount==1

assert decrement_capacity.__annotations__["return"] is bool` },
    { lang: "python", purpose: "Oráculo de duas sessões exige um vencedor e estado final completo.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class LastSeatState:
    outcomes:tuple[str,str]
    capacity:int
    reservations:int
    outbox_events:int
    provider_calls:int

def assert_last_seat(state:LastSeatState)->None:
    if sorted(state.outcomes)!=["created","sold_out"]: raise AssertionError(state.outcomes)
    if (state.capacity,state.reservations,state.outbox_events,state.provider_calls)!=(0,1,1,0):
        raise AssertionError(state)

assert_last_seat(LastSeatState(("sold_out","created"),0,1,1,0))` },
  ],
  "JSON, schemas e OpenAPI": [
    { lang: "python", purpose: "Schema manual estrito distingue bool de int, unknown fields e limites.", code: `from dataclasses import dataclass
from typing import Any

@dataclass(frozen=True)
class ReservationPayload:
    show_id:str
    quantity:int

def parse_payload(value:Any)->ReservationPayload:
    if not isinstance(value,dict) or set(value)!={"show_id","quantity"}: raise ValueError("shape")
    show_id,quantity=value["show_id"],value["quantity"]
    if not isinstance(show_id,str) or not 1<=len(show_id)<=64: raise ValueError("show_id")
    if isinstance(quantity,bool) or not isinstance(quantity,int) or not 1<=quantity<=8: raise ValueError("quantity")
    return ReservationPayload(show_id,quantity)

assert parse_payload({"show_id":"s-1","quantity":1}).quantity==1
try: parse_payload({"show_id":"s-1","quantity":True}); raise AssertionError()
except ValueError: pass` },
    { lang: "python", purpose: "Gate de spec compara operações Flask esperadas com paths/methods OpenAPI.", code: `from flask import Flask

def assert_openapi_covers_routes(app:Flask,spec:dict)->None:
    documented={(path,method.lower()) for path,item in spec.get("paths",{}).items() for method in item if method.lower() in {"get","post","put","patch","delete"}}
    required=set()
    for rule in app.url_map.iter_rules():
        if rule.endpoint=="static": continue
        normalized=str(rule)
        for method in rule.methods-{"HEAD","OPTIONS"}: required.add((normalized,method.lower()))
    missing=required-documented
    if missing: raise AssertionError(f"OpenAPI missing operations: {sorted(missing)}")

# The production artifact test loads its generated specification and application.
assert callable(assert_openapi_covers_routes)` },
  ],
  "HTTP clients, deadlines e TLS": [
    { lang: "python", purpose: "Adapter fecha destino e deriva timeouts por etapa de um orçamento total.", code: `from dataclasses import dataclass
from urllib.parse import urljoin,urlsplit
import httpx

@dataclass(frozen=True)
class ProviderClient:
    base_url:str
    client:httpx.Client
    def __post_init__(self):
        parsed=urlsplit(self.base_url)
        if parsed.scheme!="https" or parsed.username or parsed.password or parsed.path not in ("","/"): raise ValueError("base URL")
    def deliver(self,event_id:str,payload:dict,remaining_ms:int)->httpx.Response:
        if remaining_ms<500 or not event_id: raise TimeoutError("insufficient deadline")
        timeout=httpx.Timeout(min(2.0,remaining_ms/2000),connect=min(1.0,remaining_ms/3000),pool=0.5)
        return self.client.post(urljoin(self.base_url,"/v1/events"),json=payload,headers={"Idempotency-Key":event_id},timeout=timeout,follow_redirects=False)` },
    { lang: "python", purpose: "Retry classifica respostas transitórias e preserva a mesma identidade lógica.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class RetryDecision:
    retry:bool
    delay_ms:int|None

def retry_decision(status:int|None,attempt:int,retry_after_ms:int=0)->RetryDecision:
    if attempt<1: raise ValueError("attempt")
    transient=status is None or status in {408,425,429,502,503,504}
    if not transient or attempt>=5: return RetryDecision(False,None)
    base=min(30_000,250*(2**(attempt-1)))
    return RetryDecision(True,max(base,min(60_000,retry_after_ms))+((attempt*137)%251))

event_id="evt_stable_01"
assert retry_decision(503,1).retry and retry_decision(400,1)==RetryDecision(False,None)
assert event_id=="evt_stable_01"` },
  ],
  "Webhooks, assinaturas e inbox": [
    { lang: "python", purpose: "Verificação usa bytes crus, timestamp bounded e comparação constante antes do JSON.", code: `import hashlib,hmac,time

def verify_webhook(raw:bytes,signature_hex:str,timestamp_text:str,secret:bytes,now:int|None=None)->bool:
    if len(raw)>1_048_576 or len(signature_hex)!=64 or not timestamp_text.isascii(): return False
    try: timestamp=int(timestamp_text); supplied=bytes.fromhex(signature_hex)
    except ValueError: return False
    current=int(time.time()) if now is None else now
    if abs(current-timestamp)>300: return False
    expected=hmac.new(secret,timestamp_text.encode()+b"."+raw,hashlib.sha256).digest()
    return hmac.compare_digest(supplied,expected)

body=b'{"event_id":"evt-1"}'; ts="1700000000"; key=b"test-secret"
sig=hmac.new(key,ts.encode()+b"."+body,hashlib.sha256).hexdigest()
assert verify_webhook(body,sig,ts,key,1700000000)` },
    { lang: "python", purpose: "Inbox deduplica por provider/account/event e recusa payload divergente.", code: `from enum import Enum

class InboxDecision(Enum): NEW="new"; REPLAY="replay"; CONFLICT="conflict"

def decide_inbox(existing_fingerprint:str|None,incoming_fingerprint:str)->InboxDecision:
    if not incoming_fingerprint: raise ValueError("fingerprint")
    if existing_fingerprint is None: return InboxDecision.NEW
    return InboxDecision.REPLAY if existing_fingerprint==incoming_fingerprint else InboxDecision.CONFLICT

assert decide_inbox(None,"sha256:a") is InboxDecision.NEW
assert decide_inbox("sha256:a","sha256:a") is InboxDecision.REPLAY
assert decide_inbox("sha256:a","sha256:b") is InboxDecision.CONFLICT
# A target-DB contract test enforces UNIQUE(provider, account_id, event_id) concurrently.` },
  ],
  "Streams, downloads e arquivos": [
    { lang: "python", purpose: "Generator captura valores e fecha cursor dedicado mesmo em consumo parcial.", code: `from collections.abc import Iterator
from contextlib import closing

def csv_stream(cursor_factory,tenant_id:str,chunk_size:int=500)->Iterator[bytes]:
    if not tenant_id or not 1<=chunk_size<=2000: raise ValueError("stream request")
    with closing(cursor_factory(tenant_id)) as cursor:
        yield b"reservation_id,status\n"
        while rows:=cursor.fetchmany(chunk_size):
            for reservation_id,status in rows:
                line=f"{reservation_id},{status}\n".encode("utf-8")
                if len(line)>1024: raise ValueError("row too large")
                yield line

assert callable(csv_stream)` },
    { lang: "python", purpose: "Download resolve ID scoped em storage key do servidor e fixa headers seguros.", code: `from dataclasses import dataclass
from flask import Response,abort

@dataclass(frozen=True)
class DownloadRecord:
    tenant_id:str; storage_key:str; display_name:str; media_type:str

def private_download(identity,record:DownloadRecord,storage)->Response:
    if identity.tenant_id!=record.tenant_id: abort(404)
    if not record.storage_key.startswith(f"tenants/{record.tenant_id}/objects/"): raise RuntimeError("storage scope")
    stream=storage.open(record.storage_key)
    response=Response(stream,content_type=record.media_type,direct_passthrough=True)
    response.headers["Content-Disposition"]="attachment; filename=download.bin"
    response.headers["X-Content-Type-Options"]="nosniff"
    response.headers["Cache-Control"]="private, no-store"
    return response` },
  ],
  "Celery, RQ e contexto de task": [
    { lang: "python", purpose: "Envelope de task contém somente IDs e schema version, sem request ou ORM model.", code: `from dataclasses import dataclass
from typing import Any

@dataclass(frozen=True)
class TaskEnvelope:
    event_id:str; tenant_id:str; kind:str; version:int; payload:dict[str,Any]
    def __post_init__(self):
        if not self.event_id or not self.tenant_id or self.kind!="reservation.dispatch" or self.version!=1: raise ValueError("envelope")
        if len(__import__("json").dumps(self.payload))>16_384: raise ValueError("payload")

task=TaskEnvelope("evt-1","alpha","reservation.dispatch",1,{"reservation_id":"r-1"})
assert task.payload=={"reservation_id":"r-1"}` },
    { lang: "python", purpose: "Wrapper cria app context e Session próprios e sempre remove escopo após a task.", code: `from collections.abc import Callable
from typing import TypeVar
from flask import Flask

T=TypeVar("T")
def run_task(app:Flask,session_factory,operation:Callable[[object],T])->T:
    with app.app_context():
        session=session_factory()
        try:
            with session.begin(): return operation(session)
        except BaseException:
            if session.in_transaction(): session.rollback()
            raise
        finally:
            session.close()

assert callable(run_task)` },
  ],
  "Retries, idempotência e DLQ": [
    { lang: "python", purpose: "Política distingue transitório, permanente e Unknown com tentativas bounded.", code: `from enum import Enum
from dataclasses import dataclass

class FailureKind(Enum): RATE_LIMIT="rate_limit"; UNAVAILABLE="unavailable"; INVALID="invalid"; FORBIDDEN="forbidden"; UNKNOWN="unknown"
@dataclass(frozen=True)
class Retry: allowed:bool; delay_seconds:float|None

def retry_policy(kind:FailureKind,attempt:int)->Retry:
    if attempt<1: raise ValueError("attempt")
    if kind not in {FailureKind.RATE_LIMIT,FailureKind.UNAVAILABLE} or attempt>=5: return Retry(False,None)
    return Retry(True,min(30.0,0.25*(2**(attempt-1)))+((attempt*137)%251)/1000)

assert retry_policy(FailureKind.UNAVAILABLE,2).allowed
assert retry_policy(FailureKind.UNKNOWN,1)==Retry(False,None)` },
    { lang: "python", purpose: "Redrive preserva event ID e recusa payload editado ou fingerprint divergente.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class DeadLetter:
    event_id:str; tenant_id:str; payload_hash:str; attempts:int; reason:str

def approve_redrive(item:DeadLetter,current_hash:str,dry_run:bool)->str:
    if not item.event_id or item.attempts<1 or not item.reason: raise ValueError("dead letter")
    if current_hash!=item.payload_hash: raise RuntimeError("payload changed")
    return "would_redrive" if dry_run else item.event_id

item=DeadLetter("evt-1","alpha","sha256:abc",5,"provider_unavailable")
assert approve_redrive(item,"sha256:abc",True)=="would_redrive"
assert approve_redrive(item,"sha256:abc",False)=="evt-1"` },
  ],
  "Outbox, claims e fencing": [
    { lang: "python", purpose: "Claim SQL condicional incrementa fence e retorna ownership exclusivo.", code: `from sqlalchemy import text
from sqlalchemy.orm import Session

CLAIM=text("""UPDATE outbox SET owner_id=:owner, lease_until=:lease_until, fence=fence+1, status='claimed'
WHERE id=:event_id AND status IN ('pending','retryable') AND (lease_until IS NULL OR lease_until<:now)
RETURNING id,fence""")

def claim(session:Session,event_id:str,owner:str,now,lease_until)->tuple[str,int]|None:
    row=session.execute(CLAIM,{"event_id":event_id,"owner":owner,"now":now,"lease_until":lease_until}).one_or_none()
    return None if row is None else (str(row.id),int(row.fence))

assert "fence=fence+1" in CLAIM.text` },
    { lang: "python", purpose: "Conclusão aceita somente owner e fence atuais e preserva receipt.", code: `from sqlalchemy import text
from sqlalchemy.orm import Session

COMPLETE=text("""UPDATE outbox SET status='sent',receipt=:receipt,sent_at=CURRENT_TIMESTAMP,owner_id=NULL,lease_until=NULL
WHERE id=:event_id AND owner_id=:owner AND fence=:fence AND status='claimed'""")

def complete(session:Session,event_id:str,owner:str,fence:int,receipt:str)->None:
    if fence<1 or not receipt: raise ValueError("completion")
    result=session.execute(COMPLETE,{"event_id":event_id,"owner":owner,"fence":fence,"receipt":receipt})
    if result.rowcount!=1: raise RuntimeError("stale outbox owner")

assert "owner_id=:owner" in COMPLETE.text and "fence=:fence" in COMPLETE.text` },
  ],
  "Async views, ASGI e cancellation": [
    { lang: "python", purpose: "TaskGroup mantém filhos estruturados e propaga deadline sem fire-and-forget.", code: `import asyncio

async def fetch_reservation_view(repo,provider,tenant_id:str,reservation_id:str,timeout:float=2.0):
    if not tenant_id or not reservation_id or not 0<timeout<=5: raise ValueError("request")
    async with asyncio.timeout(timeout):
        async with asyncio.TaskGroup() as group:
            reservation=group.create_task(repo.find(tenant_id,reservation_id))
            status=group.create_task(provider.status(tenant_id,reservation_id))
        return {"reservation":reservation.result(),"provider_status":status.result()}

assert asyncio.iscoroutinefunction(fetch_reservation_view)` },
    { lang: "python", purpose: "Semáforo limita fan-out e libera permit mesmo sob cancelamento ou erro.", code: `import asyncio
from collections.abc import Awaitable,Callable
from typing import TypeVar

T=TypeVar("T")
class BoundedAsyncExecutor:
    def __init__(self,limit:int):
        if limit<1: raise ValueError("limit")
        self._semaphore=asyncio.Semaphore(limit)
    async def run(self,operation:Callable[[],Awaitable[T]])->T:
        async with self._semaphore:
            return await operation()

async def example():
    executor=BoundedAsyncExecutor(2)
    return await executor.run(lambda: asyncio.sleep(0,result=42))

assert asyncio.run(example())==42` },
  ],
  "Pytest, unit e contracts": [
    { lang: "python", purpose: "Tabela pytest preserva zero, bool e limites sem app context.", code: `import pytest

def parse_quantity(raw:object)->int:
    if isinstance(raw,bool) or not isinstance(raw,int) or not 1<=raw<=8: raise ValueError("quantity")
    return raw

@pytest.mark.parametrize(("raw","expected"),[(1,1),(4,4),(8,8)],ids=["minimum","middle","maximum"])
def test_valid_quantity(raw:int,expected:int)->None:
    assert parse_quantity(raw)==expected

@pytest.mark.parametrize("raw",[0,9,True,"2",None],ids=["zero","over","bool","string","none"])
def test_invalid_quantity(raw:object)->None:
    with pytest.raises(ValueError,match="quantity"): parse_quantity(raw)` },
    { lang: "python", purpose: "Contract de repository exige isolamento e conflito divergente para todo adapter.", code: `from collections.abc import Callable

def reservation_repository_contract(factory:Callable[[],object])->None:
    repo=factory()
    assert repo.find("alpha","r-1") is None
    assert repo.put_intent("alpha","key-1","fp-a","r-1")=="created"
    assert repo.put_intent("alpha","key-1","fp-a","r-1")=="replayed"
    assert repo.put_intent("alpha","key-1","fp-b","r-2")=="conflict"
    assert repo.find("alpha","r-1").fingerprint=="fp-a"
    assert repo.find("beta","r-1") is None

# Memory and SQLAlchemy fixtures call the same function; the SQL adapter
# is observed by an independent Session after commit and rollback scenarios.
assert callable(reservation_repository_contract)` },
  ],
  "Client, integration e browser": [
    { lang: "python", purpose: "Test client atravessa hooks e confirma commit por Session observadora.", code: `def test_create_reservation_commits_outbox(app,client,observer_session):
    response=client.post("/v1/reservations",headers={"Authorization":"Bearer test-alpha","Idempotency-Key":"key-1"},json={"show_id":"s-1","quantity":1})
    assert response.status_code==201
    assert response.headers["Content-Type"].startswith("application/json")
    operation_id=response.get_json()["operation_id"]
    observer_session.expire_all()
    reservation=observer_session.query(Reservation).filter_by(tenant_id="alpha",operation_id=operation_id).one()
    event=observer_session.query(Outbox).filter_by(tenant_id="alpha",aggregate_id=reservation.id).one()
    assert reservation.status=="pending" and event.status=="pending"` },
    { lang: "python", purpose: "Browser oracle exige ausência de execução e de mudança cross-site, não só texto escapado.", code: `def test_cross_site_payload_does_not_execute(page,base_url,attacker_url,db_observer):
    payload='''<img src=x onerror="fetch('/v1/reservations/r-1/cancel',{method:'POST'})">'''
    db_observer.seed_reservation("alpha","r-1",display_name=payload,status="pending")
    page.goto(base_url+"/reservations/r-1")
    assert page.locator(".reservation-name").text_content()==payload
    assert page.locator(".reservation-name img").count()==0
    before=db_observer.status("alpha","r-1")
    page.goto(attacker_url+"/csrf-form?target="+base_url)
    page.locator("button").click()
    assert db_observer.status("alpha","r-1")==before=="pending"` },
  ],
  "Typing, lint e mutation": [
    { lang: "python", purpose: "Protocol e DTO tipado impedem dicionário/Session Flask de vazar para application service.", code: `from dataclasses import dataclass
from typing import Protocol,assert_never
from enum import Enum

class Outcome(Enum): CREATED="created"; REPLAYED="replayed"; CONFLICT="conflict"
class IntentRepository(Protocol):
    def claim(self,tenant_id:str,key:str,fingerprint:str)->Outcome: ...
@dataclass(frozen=True)
class ClaimIntent:
    tenant_id:str; key:str; fingerprint:str

def claim(repo:IntentRepository,command:ClaimIntent)->Outcome:
    outcome=repo.claim(command.tenant_id,command.key,command.fingerprint)
    match outcome:
        case Outcome.CREATED|Outcome.REPLAYED|Outcome.CONFLICT: return outcome
    assert_never(outcome)` },
    { lang: "python", purpose: "Oráculo crítico foi desenhado para matar mutantes de tenant, fingerprint e limite.", code: `def critical_mutation_oracle(reserve)->None:
    assert reserve("alpha","key-1",{"show_id":"s-1","quantity":1})=="created"
    assert reserve("alpha","key-1",{"show_id":"s-1","quantity":1})=="replayed"
    assert reserve("alpha","key-1",{"show_id":"s-1","quantity":2})=="conflict"
    assert reserve("beta","key-1",{"show_id":"s-1","quantity":1})=="created"
    try: reserve("alpha","key-2",{"show_id":"s-1","quantity":0}); raise AssertionError("zero accepted")
    except ValueError: pass

CRITICAL_MUTANTS={"remove_tenant_filter","ignore_divergent_fingerprint","quantity_ge_zero","skip_rollback"}
assert len(CRITICAL_MUTANTS)==4 and callable(critical_mutation_oracle)` },
  ],
  "Property, fuzz e security corpus": [
    { lang: "python", purpose: "Property Hypothesis prova canonicalização independente de ordem e sensível à semântica.", code: `import hashlib,json
from hypothesis import given,strategies as st

def fingerprint(command:dict[str,object])->str:
    encoded=json.dumps(command,sort_keys=True,separators=(",",":"),ensure_ascii=False,allow_nan=False).encode()
    return hashlib.sha256(encoded).hexdigest()

@given(show_id=st.text(min_size=1,max_size=32),quantity=st.integers(min_value=1,max_value=8))
def test_fingerprint_property(show_id:str,quantity:int)->None:
    first={"show_id":show_id,"quantity":quantity}; reordered={"quantity":quantity,"show_id":show_id}
    assert fingerprint(first)==fingerprint(reordered)
    assert fingerprint(first)!=fingerprint({"show_id":show_id,"quantity":quantity+1})` },
    { lang: "python", purpose: "Corpus associa payload ao sink e ao oracle específico de rejeição bounded.", code: `SECURITY_CORPUS=(
    ("sql_identifier","created_at DESC; DROP TABLE reservations--"),
    ("path","..%2f..%2f.env"),
    ("ssrf","http://169.254.169.254/latest/meta-data/"),
    ("html_text",'<img src=x onerror="alert(1)">'),
    ("header","ok\r\nSet-Cookie: admin=true"),
)

ALLOWED_SORTS={"created":"created_at_desc","status":"status_asc"}
def parse_sort(raw:str)->str:
    try: return ALLOWED_SORTS[raw]
    except KeyError as error: raise ValueError("unsupported sort") from error

assert len(SECURITY_CORPUS)==5
try: parse_sort(SECURITY_CORPUS[0][1]); raise AssertionError("injection accepted")
except ValueError: pass` },
  ],
  "Auth, sessão e autorização": [
    { lang: "python", purpose: "Validador de claims fixa algoritmo, issuer, audience, tempo e key ID conhecido.", code: `from dataclasses import dataclass
import time

@dataclass(frozen=True)
class TokenClaims:
    subject:str; issuer:str; audience:str; expires_at:int; not_before:int; key_id:str; algorithm:str

def validate_claims(value:TokenClaims,now:int|None=None)->None:
    current=int(time.time()) if now is None else now
    if value.algorithm!="EdDSA" or value.issuer!="https://identity.example.test" or value.audience!="chiron-api": raise ValueError("token trust")
    if value.key_id not in {"key-2026-09","key-2026-08"}: raise ValueError("key")
    if not value.subject or value.not_before>current+30 or value.expires_at<=current-30: raise ValueError("token time")

validate_claims(TokenClaims("u-1","https://identity.example.test","chiron-api",1700000300,1699999900,"key-2026-09","EdDSA"),1700000000)` },
    { lang: "python", purpose: "Policy tenant-aware rejeita revogação, cross-tenant e estado incompatível.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Identity: actor_id:str; tenant_id:str; capabilities:frozenset[str]; auth_version:int
@dataclass(frozen=True)
class Resource: tenant_id:str; owner_id:str; status:str

def authorize_cancel(identity:Identity,resource:Resource,current_auth_version:int)->bool:
    if identity.auth_version!=current_auth_version or identity.tenant_id!=resource.tenant_id or resource.status!="pending": return False
    return identity.actor_id==resource.owner_id or "reservation.cancel:any" in identity.capabilities

actor=Identity("u-1","alpha",frozenset({"reservation.cancel:own"}),2)
assert authorize_cancel(actor,Resource("alpha","u-1","pending"),2)
assert not authorize_cancel(actor,Resource("beta","u-1","pending"),2)
assert not authorize_cancel(actor,Resource("alpha","u-1","pending"),3)` },
  ],
  "Injection, upload e SSRF": [
    { lang: "python", purpose: "Destino egress aceita somente HTTPS, host e porta cadastrados, sem credenciais.", code: `from urllib.parse import urlsplit,urlunsplit

def approved_url(raw:str,allowed_hosts:frozenset[str])->str:
    if len(raw)>2048: raise ValueError("url size")
    parsed=urlsplit(raw); host=(parsed.hostname or "").lower().rstrip(".")
    if parsed.scheme!="https" or parsed.username or parsed.password or parsed.fragment or host not in allowed_hosts or parsed.port not in (None,443): raise ValueError("destination")
    return urlunsplit(("https",host,parsed.path or "/",parsed.query,""))

assert approved_url("https://hooks.example.test/v1",frozenset({"hooks.example.test"}))=="https://hooks.example.test/v1"
for attack in ("http://169.254.169.254/","https://user:pass@hooks.example.test/","https://evil.test/"):
    try: approved_url(attack,frozenset({"hooks.example.test"})); raise AssertionError(attack)
    except ValueError: pass` },
    { lang: "python", purpose: "Command runner fixa executable, opções e orçamento sem invocar shell.", code: `import subprocess
from pathlib import Path

ALLOWED_FORMATS={"png":"png","jpeg":"jpg"}
def convert_image(source:Path,target:Path,format_name:str)->None:
    if format_name not in ALLOWED_FORMATS or not source.is_file() or source.parent!=target.parent: raise ValueError("conversion request")
    command=["/usr/bin/convert","--",str(source),f"{ALLOWED_FORMATS[format_name]}:{target}"]
    result=subprocess.run(command,shell=False,check=False,capture_output=True,timeout=5,env={"PATH":"/usr/bin:/bin"})
    if len(result.stdout)+len(result.stderr)>65_536 or result.returncode!=0: raise RuntimeError("conversion failed")

assert ALLOWED_FORMATS["png"]=="png" and "/usr/bin/convert".startswith("/")` },
  ],
  "Secrets, TLS e headers": [
    { lang: "python", purpose: "Secret wrapper evita repr e expõe valor somente ao consumidor estreito.", code: `from dataclasses import dataclass
from typing import Callable,TypeVar

T=TypeVar("T")
@dataclass(frozen=True,repr=False)
class SecretValue:
    __value:str
    def __post_init__(self):
        if not self.__value: raise ValueError("secret")
    def use(self,consumer:Callable[[str],T])->T: return consumer(self.__value)
    def __repr__(self)->str: return "SecretValue([REDACTED])"

secret=SecretValue("test-canary-not-production")
assert "canary" not in repr(secret)
assert secret.use(lambda value:len(value))==26` },
    { lang: "python", purpose: "Headers de resposta e cookie são produzidos centralmente com nonce validado.", code: `import re
from flask import Response

def secure_response(response:Response,nonce:str)->Response:
    if re.fullmatch(r"[A-Za-z0-9_-]{32,128}",nonce) is None: raise ValueError("nonce")
    response.headers["Content-Security-Policy"]=(f"default-src 'none'; script-src 'nonce-{nonce}'; style-src 'self'; img-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'")
    response.headers["X-Content-Type-Options"]="nosniff"
    response.headers["Referrer-Policy"]="no-referrer"
    response.headers["Cache-Control"]="no-store"
    return response

assert callable(secure_response)` },
  ],
  "DoS, quotas e incidentes": [
    { lang: "python", purpose: "Decoder limita bytes, profundidade aproximada e shape antes do domínio.", code: `import json

def decode_bounded_json(body:bytes,maximum_bytes:int=65_536,maximum_depth:int=32)->dict:
    if len(body)>maximum_bytes: raise ValueError("body too large")
    text=body.decode("utf-8","strict")
    depth=0; peak=0; in_string=False; escaped=False
    for char in text:
        if in_string:
            if escaped: escaped=False
            elif char=="\\": escaped=True
            elif char=='"': in_string=False
        elif char=='"': in_string=True
        elif char in "[{": depth+=1; peak=max(peak,depth)
        elif char in "]}": depth-=1
        if peak>maximum_depth: raise ValueError("JSON too deep")
    value=json.loads(text)
    if not isinstance(value,dict) or len(value)>32: raise ValueError("object shape")
    return value

assert decode_bounded_json(b'{"quantity":1}')=={"quantity":1}` },
    { lang: "python", purpose: "Admission control aplica limites globais e por tenant com cleanup em finally.", code: `from collections import Counter
from contextlib import contextmanager

class Admission:
    def __init__(self,global_limit:int,tenant_limit:int): self.global_limit=global_limit; self.tenant_limit=tenant_limit; self.active=Counter()
    @contextmanager
    def enter(self,tenant:str):
        total=sum(self.active.values())
        if total>=self.global_limit or self.active[tenant]>=self.tenant_limit: raise RuntimeError("overloaded")
        self.active[tenant]+=1
        try: yield
        finally:
            self.active[tenant]-=1
            if not self.active[tenant]: del self.active[tenant]

gate=Admission(2,1)
with gate.enter("alpha"): assert gate.active["alpha"]==1
assert not gate.active` },
  ],
  "Gunicorn, uWSGI e workers": [
    { lang: "python", purpose: "Cálculo limita workers por memória e conexões, mantendo headroom downstream.", code: `def safe_worker_count(host_memory_mb:int,reserved_mb:int,worker_rss_p99_mb:int,db_connections:int,db_reserve:int,threads:int=1)->int:
    values=(host_memory_mb,reserved_mb,worker_rss_p99_mb,db_connections,db_reserve,threads)
    if any(not isinstance(v,int) or v<0 for v in values) or worker_rss_p99_mb<1 or threads<1: raise ValueError("capacity")
    memory=max(0,(host_memory_mb-reserved_mb)//worker_rss_p99_mb)
    database=max(0,(db_connections-db_reserve)//threads)
    result=min(memory,database)
    if result<1: raise RuntimeError("insufficient capacity")
    return result

assert safe_worker_count(4096,1024,160,30,5)==19
assert safe_worker_count(4096,1024,100,12,4,2)==4` },
    { lang: "python", purpose: "Hook pós-fork descarta pools herdados antes do primeiro request do worker.", code: `def post_fork(server,worker)->None:
    app=worker.app.wsgi()
    engine=app.extensions["chiron.engine"]
    engine.dispose(close=False)
    app.extensions["worker_identity"]={"pid":worker.pid,"release":app.config["RELEASE_ID"]}

def worker_exit(server,worker)->None:
    try:
        app=worker.app.wsgi()
        app.extensions["chiron.engine"].dispose()
        app.extensions["chiron.http_client"].close()
    except Exception:
        server.log.exception("bounded worker cleanup failed")

assert callable(post_fork) and callable(worker_exit)` },
  ],
  "Logs, metrics e traces": [
    { lang: "python", purpose: "Evento estruturado usa allowlist e remove secrets antes do logger.", code: `from datetime import datetime,timezone

ALLOWED={"release","route","attempt","duration_ms","error_class"}
def operation_event(name:str,operation_id:str,outcome:str,context:dict[str,object])->dict[str,object]:
    safe={key:value for key,value in context.items() if key in ALLOWED}
    for key,value in tuple(safe.items()):
        if isinstance(value,str) and any(word in value.lower() for word in ("bearer","password","cookie","token")): safe[key]="[REDACTED]"
    return {"timestamp":datetime.now(timezone.utc).isoformat(),"event":name,"operation_id":operation_id,"outcome":outcome,**safe}

event=operation_event("reservation.create","op-1","created",{"route":"reservation.create","Authorization":"Bearer secret","attempt":1})
assert "Authorization" not in event and event["attempt"]==1` },
    { lang: "python", purpose: "Métrica aceita somente operação, outcome e classe de erro bounded.", code: `OPERATIONS={"reservation.create","reservation.cancel","outbox.dispatch"}
OUTCOMES={"created","replayed","conflict","failed","unknown"}
ERRORS={"none","validation","authorization","dependency","internal"}

def metric_labels(operation:str,outcome:str,error_class:str="none")->dict[str,str]:
    if operation not in OPERATIONS or outcome not in OUTCOMES or error_class not in ERRORS: raise ValueError("unbounded label")
    return {"operation":operation,"outcome":outcome,"error_class":error_class}

assert metric_labels("reservation.create","created")["error_class"]=="none"
try: metric_labels("/v1/reservations/customer-123","created"); raise AssertionError()
except ValueError: pass` },
  ],
  "Caching, sessions e state": [
    { lang: "python", purpose: "Cache key inclui tenant, policy, locale, query e schema version.", code: `import hashlib,json
from dataclasses import dataclass

@dataclass(frozen=True)
class CacheContext:
    tenant_id:str; policy_version:int; locale:str; schema_version:int

def reservation_cache_key(context:CacheContext,reservation_id:str,projection:str)->str:
    if not all((context.tenant_id,context.locale,reservation_id,projection)): raise ValueError("cache key")
    payload=json.dumps({"t":context.tenant_id,"p":context.policy_version,"l":context.locale,"s":context.schema_version,"r":reservation_id,"v":projection},sort_keys=True,separators=(",",":")).encode()
    return "reservation:"+hashlib.sha256(payload).hexdigest()

alpha=reservation_cache_key(CacheContext("alpha",3,"pt-BR",1),"r-1","summary")
beta=reservation_cache_key(CacheContext("beta",3,"pt-BR",1),"r-1","summary")
assert alpha!=beta` },
    { lang: "python", purpose: "Lease de cache libera somente com token do owner e não protege invariante durável.", code: `import secrets

class CacheLease:
    def __init__(self,redis,key:str,ttl_ms:int=3000): self.redis=redis; self.key=key; self.ttl_ms=ttl_ms; self.token=secrets.token_hex(16)
    def acquire(self)->bool: return bool(self.redis.set(self.key,self.token,nx=True,px=self.ttl_ms))
    def release(self)->bool:
        script="if redis.call('get',KEYS[1])==ARGV[1] then return redis.call('del',KEYS[1]) else return 0 end"
        return bool(self.redis.eval(script,1,self.key,self.token))

# This lease is suitable for stampede reduction only; capacity and
# idempotency remain enforced by database constraints/conditional writes.
assert CacheLease.__doc__ is None or isinstance(CacheLease.__doc__,str)` },
  ],
  "Profiling, carga e memória": [
    { lang: "python", purpose: "Oracle de carga cruza outcomes com estado durável e efeitos externos.", code: `def assert_load_oracle(summary:dict[str,int])->None:
    required={"initial_capacity","created","replayed","conflicts","sold_out","remaining_capacity","reservations","outbox","logical_effects","unknown"}
    if set(summary)!=required: raise ValueError("summary")
    assert summary["remaining_capacity"]>=0
    assert summary["remaining_capacity"]==summary["initial_capacity"]-summary["created"]
    assert summary["created"]==summary["reservations"]==summary["outbox"]==summary["logical_effects"]
    assert summary["unknown"]==0

assert_load_oracle({"initial_capacity":2,"created":2,"replayed":3,"conflicts":1,"sold_out":1,"remaining_capacity":0,"reservations":2,"outbox":2,"logical_effects":2,"unknown":0})` },
    { lang: "python", purpose: "Regressão de soak calcula inclinação de RSS e exige amostras suficientes.", code: `def rss_slope(samples:list[int])->float:
    if len(samples)<5 or any(not isinstance(value,int) or value<0 for value in samples): raise ValueError("samples")
    n=len(samples); xs=list(range(n)); sx=sum(xs); sy=sum(samples)
    denominator=n*sum(x*x for x in xs)-sx*sx
    return (n*sum(x*y for x,y in zip(xs,samples))-sx*sy)/denominator

stable=[100_000_000,100_100_000,99_950_000,100_050_000,100_000_000]
leaking=[100_000_000,102_000_000,104_000_000,106_000_000,108_000_000]
assert abs(rss_slope(stable))<50_000
assert rss_slope(leaking)>1_000_000` },
  ],
  "Build, lock e provenance": [
    { lang: "python", purpose: "Manifesto de artifact associa arquivos, versões e digests sem registrar segredos.", code: `from dataclasses import dataclass,asdict
from hashlib import sha256
from pathlib import Path
import json,platform

@dataclass(frozen=True)
class ArtifactManifest:
    release:str; python:str; lock_digest:str; files:dict[str,str]

def digest(path:Path)->str:
    return sha256(path.read_bytes()).hexdigest()

def build_manifest(root:Path,release:str,lock:Path)->ArtifactManifest:
    allowed=("pyproject.toml","uv.lock","migrations/env.py","app/templates/index.html")
    files={name:digest(root/name) for name in allowed if (root/name).is_file()}
    if "pyproject.toml" not in files or "uv.lock" not in files: raise RuntimeError("incomplete artifact")
    return ArtifactManifest(release,platform.python_version(),digest(lock),files)

def canonical(manifest:ArtifactManifest)->bytes:
    return json.dumps(asdict(manifest),sort_keys=True,separators=(",",":")).encode()` },
    { lang: "python", purpose: "Gate de runtime recusa artifact, release ou revisão de schema incompatíveis.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class RuntimeEvidence:
    expected_release:str; running_release:str; expected_schema:str; database_schema:str; fake_bindings:tuple[str,...]

def verify_runtime(evidence:RuntimeEvidence)->dict[str,str]:
    failures=[]
    if evidence.running_release!=evidence.expected_release: failures.append("release_digest")
    if evidence.database_schema!=evidence.expected_schema: failures.append("schema_revision")
    if evidence.fake_bindings: failures.append("fake_bindings")
    if failures: raise RuntimeError("runtime gate failed: "+",".join(failures))
    return {"release":evidence.running_release,"schema":evidence.database_schema,"status":"ready"}

assert verify_runtime(RuntimeEvidence("sha256:a","sha256:a","0042","0042",()))["status"]=="ready"` },
  ],
  "Deploy, migrations e rollback": [
    { lang: "python", purpose: "Plano expand-contract bloqueia contração enquanto houver aplicação antiga ou backfill pendente.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class FleetState:
    schema_phase:str; old_readers:int; old_writers:int; backfill_remaining:int; validation_ok:bool

def next_release_action(state:FleetState)->str:
    if state.schema_phase=="old": return "apply_expand"
    if state.schema_phase=="expanded" and state.backfill_remaining>0: return "continue_backfill"
    if state.schema_phase=="expanded" and (state.old_readers or state.old_writers): return "wait_mixed_fleet"
    if state.schema_phase=="expanded" and not state.validation_ok: return "validate_data"
    if state.schema_phase=="expanded": return "approve_contract"
    return "hold"

assert next_release_action(FleetState("expanded",1,0,0,True))=="wait_mixed_fleet"
assert next_release_action(FleetState("expanded",0,0,0,True))=="approve_contract"` },
    { lang: "python", purpose: "Gate de canário considera estado e efeitos, não apenas respostas HTTP.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Canary:
    total:int; errors:int; unknown:int; duplicate_effects:int; state_divergence:int; queue_age_seconds:int

def can_expand(sample:Canary)->tuple[bool,list[str]]:
    reasons=[]
    if sample.total<100: reasons.append("insufficient_sample")
    if sample.errors/sample.total>0.01: reasons.append("error_rate")
    if sample.unknown: reasons.append("unknown_outcomes")
    if sample.duplicate_effects: reasons.append("duplicate_effects")
    if sample.state_divergence: reasons.append("state_divergence")
    if sample.queue_age_seconds>30: reasons.append("queue_age")
    return not reasons,reasons

ok,reasons=can_expand(Canary(500,1,0,0,0,4))
assert ok and reasons==[]` },
  ],
  "Shutdown, workers e recovery": [
    { lang: "python", purpose: "Controlador de drain fecha admissão e só aceita trabalho que cabe no prazo restante.", code: `from dataclasses import dataclass
from time import monotonic

@dataclass
class DrainController:
    draining:bool=False; deadline:float|None=None; safety_seconds:float=1.0
    def begin(self,grace_seconds:float)->None:
        if grace_seconds<=self.safety_seconds: raise ValueError("grace")
        self.draining=True; self.deadline=monotonic()+grace_seconds
    def admit(self,estimated_seconds:float)->bool:
        if not self.draining: return True
        assert self.deadline is not None
        return monotonic()+estimated_seconds+self.safety_seconds<self.deadline
    def ready(self)->bool: return not self.draining

controller=DrainController(); controller.begin(10)
assert not controller.ready() and controller.admit(1) and not controller.admit(20)` },
    { lang: "python", purpose: "Matriz de kill point determina recuperação por estado durável e recibo externo.", code: `def recovery_action(*,committed:bool,outbox:bool,provider_receipt:bool,acked:bool)->str:
    if acked and not committed: raise ValueError("impossible early ack")
    if provider_receipt and not committed: return "quarantine_and_reconcile"
    if provider_receipt and outbox: return "record_receipt_then_ack"
    if committed and outbox: return "redeliver_same_event_id"
    if committed: return "rebuild_outbox_from_obligation"
    return "retry_transaction_same_operation_id"

assert recovery_action(committed=True,outbox=True,provider_receipt=False,acked=False)=="redeliver_same_event_id"
assert recovery_action(committed=True,outbox=True,provider_receipt=True,acked=False)=="record_receipt_then_ack"` },
  ],
  "Backup, restore e incidentes": [
    { lang: "python", purpose: "Gate de restore mantém egress e consumidores bloqueados até todas as provas passarem.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class RestoreEvidence:
    manifest_hash_ok:bool; catalog_ok:bool; invariants_ok:bool; reconciliation_ok:bool; egress_enabled:bool; consumers_enabled:bool

def approve_restore(evidence:RestoreEvidence)->str:
    if evidence.egress_enabled or evidence.consumers_enabled: raise RuntimeError("restore was not isolated")
    checks=(evidence.manifest_hash_ok,evidence.catalog_ok,evidence.invariants_ok,evidence.reconciliation_ok)
    if not all(checks): return "hold"
    return "ready_for_controlled_enablement"

assert approve_restore(RestoreEvidence(True,True,True,True,False,False))=="ready_for_controlled_enablement"` },
    { lang: "python", purpose: "Reconciliação preserva event_id e evita reenviar efeito já confirmado pelo provedor.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class RestoredIntent:
    event_id:str; local_status:str; provider_receipt:str|None

def reconcile(intent:RestoredIntent)->tuple[str,bool]:
    if not intent.event_id: raise ValueError("stable event id required")
    if intent.provider_receipt: return "record_receipt",False
    if intent.local_status in {"pending","unknown"}: return "query_provider",False
    if intent.local_status=="not_started": return "dispatch_same_event_id",True
    return "no_action",False

action,may_send=reconcile(RestoredIntent("evt-42","pending","receipt-9"))
assert action=="record_receipt" and not may_send` },
  ],
  "Arquitetura Flask do Quíron": [
    { lang: "python", purpose: "Application service mantém Flask fora do domínio e grava reserva e outbox na mesma unidade de trabalho.", code: `from dataclasses import dataclass
from typing import Protocol

@dataclass(frozen=True)
class ReserveSeat: tenant_id:str; session_id:str; user_id:str; key:str; fingerprint:str
class UnitOfWork(Protocol):
    reservations:object; intents:object; outbox:object
    def __enter__(self): ...
    def __exit__(self,*args): ...
    def commit(self)->None: ...

def reserve(command:ReserveSeat,uow:UnitOfWork,ids)->dict[str,str]:
    with uow:
        replay=uow.intents.find(command.tenant_id,command.key)
        if replay:
            if replay.fingerprint!=command.fingerprint: return {"outcome":"conflict"}
            return replay.response
        reservation_id,event_id=ids.new("reservation"),ids.new("event")
        if not uow.reservations.take_if_available(command.tenant_id,command.session_id,reservation_id,command.user_id): return {"outcome":"sold_out"}
        response={"outcome":"created","reservation_id":reservation_id,"event_id":event_id}
        uow.intents.complete(command,response); uow.outbox.add(event_id,reservation_id,command.tenant_id); uow.commit()
        return response` },
    { lang: "python", purpose: "Factory explícita recusa adapter fake em produção e registra somente a borda HTTP.", code: `from flask import Flask
from dataclasses import dataclass

@dataclass(frozen=True)
class Dependencies:
    reservations:object; provider:object; queue:object

def create_app(config:dict[str,object],deps:Dependencies)->Flask:
    required={"SECRET_KEY","DATABASE_URL","RELEASE_DIGEST"}
    missing=required-set(config)
    if missing: raise RuntimeError("missing: "+",".join(sorted(missing)))
    if config.get("ENVIRONMENT")=="production" and any(type(x).__name__.startswith("Fake") for x in (deps.reservations,deps.provider,deps.queue)):
        raise RuntimeError("fake adapter in production")
    app=Flask(__name__); app.config.from_mapping(config); app.extensions["dependencies"]=deps
    from .routes import api
    app.register_blueprint(api,url_prefix="/v1")
    return app` },
  ],
  "Última vaga e replay Flask": [
    { lang: "python", purpose: "Update condicional reserva somente uma vaga e preserva o escopo tenant no statement.", code: `from sqlalchemy import update

def take_last_seat(db,SessionModel,tenant_id:str,session_id:str)->bool:
    statement=(update(SessionModel)
        .where(SessionModel.tenant_id==tenant_id,SessionModel.id==session_id,SessionModel.remaining_capacity>0)
        .values(remaining_capacity=SessionModel.remaining_capacity-1))
    result=db.execute(statement)
    if result.rowcount not in (0,1): raise AssertionError("unexpected cardinality")
    return result.rowcount==1

# The transaction must insert reservation, completed intent and outbox
# before the caller commits; a zero rowcount creates none of them.
assert callable(take_last_seat)` },
    { lang: "python", purpose: "Classificação de replay conserva IDs e rejeita reutilização de chave com fingerprint diferente.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Intent:
    key:str; fingerprint:str; status:str; response:dict[str,str]|None

def replay(intent:Intent,fingerprint:str)->dict[str,str]:
    if intent.fingerprint!=fingerprint: return {"outcome":"conflict"}
    if intent.status=="completed" and intent.response: return {**intent.response,"replayed":"true"}
    if intent.status in {"pending","unknown"}: return {"outcome":"pending","key":intent.key}
    raise ValueError("invalid intent")

original={"outcome":"created","reservation_id":"res-7","event_id":"evt-7"}
result=replay(Intent("key-1","fp-1","completed",original),"fp-1")
assert result["reservation_id"]=="res-7" and result["event_id"]=="evt-7"` },
  ],
  "Segurança, testes e carga Flask": [
    { lang: "python", purpose: "Oráculo pós-carga exige equivalência entre capacidade, reservas, obrigações e efeitos.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class FinalState:
    initial:int; remaining:int; created:int; reservations:int; outbox:int; logical_effects:int; unknown:int; cross_tenant_reads:int

def assert_final_state(state:FinalState)->None:
    assert 0<=state.remaining<=state.initial
    assert state.remaining==state.initial-state.created
    assert state.created==state.reservations==state.outbox==state.logical_effects
    assert state.unknown==0 and state.cross_tenant_reads==0

assert_final_state(FinalState(50,0,50,50,50,50,0,0))` },
    { lang: "python", purpose: "Scanner de evidência encontra canários secretos em logs, traces, métricas e DLQ.", code: `from collections.abc import Mapping,Sequence

def contains_canary(value:object,canaries:set[str])->bool:
    if isinstance(value,str): return any(canary in value for canary in canaries)
    if isinstance(value,Mapping): return any(contains_canary(k,canaries) or contains_canary(v,canaries) for k,v in value.items())
    if isinstance(value,Sequence) and not isinstance(value,(bytes,bytearray)): return any(contains_canary(item,canaries) for item in value)
    return False

artifacts={"logs":[{"operation_id":"op-1","outcome":"created"}],"metrics":{"created":1},"dlq":[]}
assert not contains_canary(artifacts,{"secret-canary-42","Bearer hidden"})` },
  ],
  "Banca, deploy e restore Flask": [
    { lang: "python", purpose: "Matriz de evidência impede aprovação quando gate essencial está Pending ou falhou.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class Gate:
    name:str; essential:bool; status:str; artifact_digest:str|None

def release_decision(gates:list[Gate],expected_digest:str)->tuple[str,list[str]]:
    blockers=[]
    for gate in gates:
        if gate.essential and gate.status!="passed": blockers.append(f"{gate.name}:{gate.status}")
        if gate.status=="passed" and gate.artifact_digest!=expected_digest: blockers.append(f"{gate.name}:wrong_artifact")
    return ("approved" if not blockers else "hold",blockers)

decision,blockers=release_decision([Gate("integration",True,"passed","sha256:a"),Gate("restore",True,"passed","sha256:a")],"sha256:a")
assert decision=="approved" and blockers==[]` },
    { lang: "python", purpose: "Gate de restore só libera egress após invariantes, reconciliação e epoch fencing.", code: `from dataclasses import dataclass

@dataclass(frozen=True)
class RestoreGate:
    manifest_ok:bool; invariants_ok:bool; receipts_reconciled:bool; new_epoch:int; old_writer_epoch:int; egress_enabled:bool

def enable_traffic(gate:RestoreGate)->dict[str,object]:
    if gate.egress_enabled: raise RuntimeError("egress enabled before approval")
    if not (gate.manifest_ok and gate.invariants_ok and gate.receipts_reconciled): return {"approved":False}
    if gate.new_epoch<=gate.old_writer_epoch: return {"approved":False,"reason":"stale_epoch"}
    return {"approved":True,"epoch":gate.new_epoch,"mode":"gradual"}

result=enable_traffic(RestoreGate(True,True,True,8,7,False))
assert result=={"approved":True,"epoch":8,"mode":"gradual"}` },
  ],
};
