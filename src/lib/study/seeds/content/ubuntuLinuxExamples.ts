export interface UbuntuLinuxExample {
  lang: "python" | "bash";
  scope: "local-real" | "model" | "native-config";
  purpose: string;
  code: string;
}
const p = (purpose: string, code: string, scope: UbuntuLinuxExample["scope"] = "model"): UbuntuLinuxExample => ({ lang: "python", purpose, scope, code });
const b = (purpose: string, code: string, scope: UbuntuLinuxExample["scope"] = "local-real"): UbuntuLinuxExample => ({ lang: "bash", purpose, scope, code: code.split(String.fromCharCode(92,36,123)).join(String.fromCharCode(36,123)) });
/** Todos os dados de modelo são fixtures; nenhum deles atesta enforcement no host. */
export const UBUNTU_LINUX_EXAMPLES: Record<string, [UbuntuLinuxExample, UbuntuLinuxExample]> = {
"Kernel, user space e init": [
 b("Consulta real da distribuição, kernel e PID 1; ambiente WSL não prova boot físico", String.raw`set -eu
test -r /etc/os-release
grep '^ID=ubuntu$' /etc/os-release
uname -s | grep '^Linux$'
test -n "$(ps -p 1 -o comm=)"
printf 'inventario-local-ok\n'`),
 p("Preflight de distribuição em fixture; não autentica alvo remoto", String.raw`def compatible(host):
    return host.get('distribution') == 'ubuntu' and host.get('architecture') == 'x86_64'
assert compatible({'distribution':'ubuntu','architecture':'x86_64'})
assert not compatible({'distribution':'other','architecture':'x86_64'})
assert not compatible({'distribution':'ubuntu','architecture':'unknown'})`)
],
"Boot, systemd e targets": [
 p("Requisito e ordem são relações distintas no modelo", String.raw`unit = {'after':['db.service'], 'wants':[], 'requires':[]}
assert 'db.service' in unit['after']
assert 'db.service' not in unit['requires']
unit['requires'].append('db.service')
assert set(unit['requires']) <= set(unit['after'])`),
 p("Oracle de ciclo didático; não substitui systemd-analyze", String.raw`def acyclic(graph):
    active, done = set(), set()
    def visit(node):
        if node in active: return False
        if node in done: return True
        active.add(node)
        if not all(visit(dep) for dep in graph.get(node, [])): return False
        active.remove(node); done.add(node)
        return True
    return all(visit(node) for node in graph)
assert acyclic({'web':['db'], 'db':[]})
assert not acyclic({'web':['db'], 'db':['web']})`)
],
"Pacotes, repositórios e proveniência": [
 b("Consulta real de dpkg, sem update, download ou instalação", String.raw`set -eu
version=$(dpkg-query -W -f='\${Version}' bash)
test -n "$version"
dpkg-query -W -f='\${db:Status-Status}\n' bash | grep '^installed$'
printf 'pacote-consultado-ok\n'`),
 p("Allowlist de origem em manifesto; não valida assinatura APT", String.raw`allowed = {'ubuntu-archive'}
def approved(package):
    return bool(package['version']) and package['origin'] in allowed
assert approved({'version':'fixture-1','origin':'ubuntu-archive'})
assert not approved({'version':'fixture-1','origin':'untrusted'})`)
],
"Filesystem hierarchy e ownership": [
 p("Hard link e symlink reais em diretório descartável", String.raw`import os, pathlib, tempfile
with tempfile.TemporaryDirectory() as directory:
    root = pathlib.Path(directory)
    source = root/'source'; source.write_text('baseline')
    os.link(source, root/'hard')
    (root/'symbolic').symlink_to(source)
    assert source.stat().st_ino == (root/'hard').stat().st_ino
    assert (root/'symbolic').is_symlink()
    assert source.lstat().st_ino != (root/'symbolic').lstat().st_ino`, "local-real"),
 p("Publicação local por rename; não prova durabilidade após crash", String.raw`import os, pathlib, tempfile
with tempfile.TemporaryDirectory() as directory:
    root = pathlib.Path(directory)
    target = root/'config'; candidate = root/'candidate'
    target.write_text('old'); candidate.write_text('new')
    os.replace(candidate, target)
    assert target.read_text() == 'new'
    assert not candidate.exists()`, "local-real")
],
"Bash, quoting e expansão": [
 b("Array conserva um argumento com espaços", String.raw`set -eu
args=('diretorio com espacos' '--flag')
test "\${#args[@]}" -eq 2
check() { test "$#" -eq 2; test "$1" = 'diretorio com espacos'; }
check "\${args[@]}"`),
 b("Glob expande; aspas conservam padrão literal em cwd descartável", String.raw`set -eu
touch alpha.txt beta.txt
pattern='*.txt'
set -- "$pattern"
test "$#" -eq 1
test "$1" = '*.txt'
set -- $pattern
test "$#" -eq 2`)
],
"Processos, signals e jobs": [
 b("Wait recolhe status do filho criado pelo ensaio", String.raw`set -u
(exit 7) &
child=$!
wait "$child"
status=$?
test "$status" -eq 7`),
 p("TERM cooperativo no filho efêmero, com timeout e cleanup", String.raw`import pathlib, subprocess, sys, tempfile
with tempfile.TemporaryDirectory() as directory:
    root = pathlib.Path(directory)
    program = "import signal,time,pathlib; signal.signal(signal.SIGTERM,lambda *_:exit(0)); pathlib.Path('ready').write_text('1'); time.sleep(10)"
    child = subprocess.Popen([sys.executable, '-c', program], cwd=root)
    try:
        import time
        deadline = time.monotonic()+3
        while not (root/'ready').exists() and time.monotonic()<deadline: time.sleep(.01)
        assert (root/'ready').exists()
        child.terminate()
        assert child.wait(timeout=3) == 0
    finally:
        if child.poll() is None: child.kill(); child.wait(timeout=3)`, "local-real")
],
"Pipes, redirection e status": [
 b("Captura imediata de PIPESTATUS detecta falha anterior", String.raw`set -u
set -o pipefail
false | cat
statuses=("\${PIPESTATUS[@]}")
test "\${statuses[0]}" -eq 1
test "\${statuses[1]}" -eq 0`),
 b("Separação real de stdout e stderr sem tocar logs do sistema", String.raw`set -eu
{ printf 'output\n'; printf 'diagnostic\n' >&2; } >out.log 2>err.log
test "$(cat out.log)" = output
test "$(cat err.log)" = diagnostic`)
],
"Scripts idempotentes e logs": [
 p("Duas reconciliações de arquivo, segunda sem mutação", String.raw`import pathlib, tempfile
def reconcile(path, desired):
    if path.exists() and path.read_text() == desired: return False
    path.write_text(desired); return True
with tempfile.TemporaryDirectory() as directory:
    target = pathlib.Path(directory)/'desired'
    assert reconcile(target, 'approved')
    assert not reconcile(target, 'approved')
    assert target.read_text() == 'approved'`, "local-real"),
 b("Lock real de flock recusa concorrente cooperativo local", String.raw`set -eu
exec 9>operation.lock
flock -n 9
if flock -n operation.lock -c true; then
  exit 1
fi
flock -u 9
flock -n operation.lock -c true`)
],
"Users, groups e sudo": [
 p("Consulta real de credenciais sem criar contas", String.raw`import os, pwd, grp
identity = pwd.getpwuid(os.geteuid())
assert identity.pw_uid == os.geteuid()
assert grp.getgrgid(os.getegid()).gr_gid == os.getegid()
assert isinstance(os.getgroups(), list)`, "local-real"),
 p("Autorização didática de ações; não é policy sudoers", String.raw`permissions = {'deployer':{'publish-approved'}, 'reader':{'inspect'}}
def permitted(principal, action):
    return action in permissions.get(principal, set())
assert permitted('deployer','publish-approved')
assert not permitted('deployer','edit-sudoers')
assert not permitted('unknown','inspect')`)
],
"ACLs, umask e capabilities": [
 p("Modos reais de criação sob umasks diferentes; não testa ACL", String.raw`import os, pathlib, stat, tempfile
with tempfile.TemporaryDirectory() as directory:
    previous = os.umask(0o077)
    try:
        private = pathlib.Path(directory)/'private'; private.touch()
        os.umask(0o022)
        ordinary = pathlib.Path(directory)/'ordinary'; ordinary.touch()
        assert stat.S_IMODE(private.stat().st_mode) == 0o600
        assert stat.S_IMODE(ordinary.stat().st_mode) == 0o644
    finally: os.umask(previous)`, "local-real"),
 p("Allowlist de capabilities em modelo; não concede privilégios", String.raw`allowed_caps = {'CAP_NET_BIND_SERVICE'}
def valid_caps(requested): return set(requested) <= allowed_caps
assert valid_caps([])
assert valid_caps(['CAP_NET_BIND_SERVICE'])
assert not valid_caps(['CAP_SYS_ADMIN'])`)
],
"SSH, chaves e bastion": [
 b("Chave SSH efêmera real; não faz login remoto", String.raw`set -eu
ssh-keygen -q -t ed25519 -N '' -f ephemeral_key
ssh-keygen -lf ephemeral_key.pub | grep 'SHA256:' >/dev/null
test -s ephemeral_key
rm -- ephemeral_key ephemeral_key.pub`),
 p("Pinagem didática de fingerprint; não autentica servidor", String.raw`trusted = {'bastion.lab':'SHA256:fixture-approved'}
def match(host, fingerprint): return trusted.get(host) == fingerprint
assert match('bastion.lab','SHA256:fixture-approved')
assert not match('bastion.lab','SHA256:fixture-other')
assert not match('unknown','SHA256:fixture-approved')`)
],
"PAM, MFA e break-glass": [
 p("Modelo de fatores; não carrega stack PAM", String.raw`def authenticate(password_ok, factor_ok, account_enabled):
    return password_ok and factor_ok and account_enabled
assert authenticate(True, True, True)
assert not authenticate(True, False, True)
assert not authenticate(True, True, False)`),
 p("Autorização emergencial sintética com prazo", String.raw`from datetime import datetime, timezone, timedelta
now = datetime(2026,10,1,tzinfo=timezone.utc)
def emergency_allowed(grant):
    return grant['approved'] and grant['owner'] and now < grant['expires']
grant = {'approved':True,'owner':'operator','expires':now+timedelta(minutes=15)}
assert emergency_allowed(grant)
assert not emergency_allowed({**grant,'expires':now-timedelta(seconds=1)})
assert not emergency_allowed({**grant,'approved':False})`)
],
"IP, DNS e rotas": [
 b("Consulta real de interfaces e rotas, sem alteração", String.raw`set -eu
ip -j address show >addresses.json
ip -j route show >routes.json
python3 -c 'import json; assert isinstance(json.load(open("addresses.json")),list); assert isinstance(json.load(open("routes.json")),list)'`),
 p("Cálculo CIDR local; não prova conectividade", String.raw`import ipaddress
subnet = ipaddress.ip_network('192.0.2.0/24')
assert ipaddress.ip_address('192.0.2.7') in subnet
assert ipaddress.ip_address('198.51.100.7') not in subnet
assert subnet.num_addresses == 256`)
],
"Sockets, ports e firewall": [
 p("Troca TCP real em loopback e porta efêmera; sem firewall", String.raw`import socket, threading
with socket.socket() as server:
    server.bind(('127.0.0.1',0)); server.listen(1); server.settimeout(3)
    errors=[]
    def serve():
        try:
            connection,_=server.accept()
            with connection:
                connection.settimeout(3)
                assert connection.recv(16)==b'probe'
                connection.sendall(b'ready')
        except BaseException as error: errors.append(error)
    worker=threading.Thread(target=serve); worker.start()
    try:
        with socket.create_connection(server.getsockname(),timeout=3) as client:
            client.sendall(b'probe'); assert client.recv(16)==b'ready'
    finally: worker.join(timeout=4)
    assert not worker.is_alive() and not errors`, "local-real"),
 p("Matriz de exposição didática; não aplica filtro", String.raw`allowed_flows = {('proxy',8080),('admin',22)}
assert ('proxy',8080) in allowed_flows
assert ('internet',5432) not in allowed_flows
assert ('proxy',22) not in allowed_flows`)
],
"systemd services e timers": [
 b("Verificação nativa de unidade candidata; não inicia serviço", String.raw`set -eu
cat >chiron-example.service <<'UNIT'
[Unit]
Description=Chiron disposable syntax example
[Service]
Type=oneshot
ExecStart=/usr/bin/true
UNIT
systemd-analyze verify "$PWD/chiron-example.service"`, "native-config"),
 b("Parser nativo de calendário; não dispara timer", String.raw`set -eu
systemd-analyze calendar --iterations=1 'Mon *-*-* 09:00:00' >calendar.log
grep 'Normalized form:' calendar.log >/dev/null`, "native-config")
],
"Reverse proxy e TLS": [
 p("Modelo de nome e validade; não realiza handshake", String.raw`certificate={'names':{'quiron.test'},'not_before':10,'not_after':30}
def accepts(name, instant):
    return name in certificate['names'] and certificate['not_before'] <= instant < certificate['not_after']
assert accepts('quiron.test',20)
assert not accepts('other.test',20)
assert not accepts('quiron.test',31)`),
 p("Modelo de confiança em forwarding; não configura proxy", String.raw`def forwarded_scheme(peer, headers):
    if peer != 'trusted-proxy': return 'direct'
    return headers.get('x-forwarded-proto','direct')
assert forwarded_scheme('trusted-proxy',{'x-forwarded-proto':'https'})=='https'
assert forwarded_scheme('client',{'x-forwarded-proto':'https'})=='direct'`)
],
"Partições, LVM e mounts": [
 b("Consulta real da montagem da raiz, sem montar ou particionar", String.raw`set -eu
findmnt -n -o TARGET -T / | grep '^/$'
test -n "$(findmnt -n -o SOURCE -T /)"
test -n "$(findmnt -n -o FSTYPE -T /)"`),
 p("Identidade de volume em inventário sintético", String.raw`expected_mount={'path':'/srv/quiron','uuid':'fixture-volume-a'}
def mount_matches(actual): return actual == expected_mount
assert mount_matches(dict(expected_mount))
assert not mount_matches({'path':'/srv/quiron','uuid':'fixture-volume-b'})`)
],
"ext4, XFS e permissões": [
 p("Arquivo esparso real; sem alegar tipo específico de filesystem", String.raw`import pathlib, tempfile
with tempfile.TemporaryDirectory() as directory:
    sparse=pathlib.Path(directory)/'sparse'
    with sparse.open('wb') as stream: stream.truncate(1024*1024)
    info=sparse.stat()
    assert info.st_size == 1024*1024
    assert info.st_blocks >= 0
    assert sparse.read_bytes()[:32] == bytes(32)`, "local-real"),
 p("Modo real privado e rejeição de modo público, sem testar outro usuário", String.raw`import pathlib, stat, tempfile
with tempfile.TemporaryDirectory() as directory:
    secret=pathlib.Path(directory)/'private-data'; secret.write_text('fixture')
    secret.chmod(0o600)
    assert stat.S_IMODE(secret.stat().st_mode) == 0o600
    def private_mode(mode): return mode & 0o077 == 0
    assert private_mode(0o600)
    assert not private_mode(0o644)`, "local-real")
],
"Backups, restore e retenção": [
 p("Archive e restore reais de fixture, sem banco ativo", String.raw`import pathlib, tarfile, tempfile
with tempfile.TemporaryDirectory() as directory:
    root=pathlib.Path(directory); source=root/'source'; source.mkdir()
    (source/'record').write_text('reservation=one')
    archive=root/'backup.tar'
    with tarfile.open(archive,'w') as stream: stream.add(source/'record',arcname='record')
    destination=root/'restore'; destination.mkdir()
    with tarfile.open(archive) as stream:
        assert stream.getnames()==['record']
        member=stream.extractfile('record'); assert member is not None
        (destination/'record').write_bytes(member.read())
    assert (destination/'record').read_text()==(source/'record').read_text()`, "local-real"),
 p("Retenção modelada conserva base de cadeia", String.raw`points={'base':None,'increment-1':'base','increment-2':'increment-1'}
def usable(kept): return all(points[item] is None or points[item] in kept for item in kept)
assert usable(set(points))
assert not usable({'increment-1','increment-2'})
assert usable({'base'})`)
],
"Logs, journal e rotação": [
 p("Redaction local conserva contexto sem segredo", String.raw`import json
event={'execution':'fixture-run','token':'DO-NOT-LOG','status':'failed'}
redacted={key:value for key,value in event.items() if key!='token'}
serialized=json.dumps(redacted)
assert 'DO-NOT-LOG' not in serialized
assert redacted['execution']=='fixture-run'
assert redacted['status']=='failed'`),
 p("Descritor real continua no inode renomeado; sem logrotate", String.raw`import pathlib, tempfile
with tempfile.TemporaryDirectory() as directory:
    root=pathlib.Path(directory); log=root/'current'
    with log.open('w') as writer:
        writer.write('before\n'); writer.flush()
        log.rename(root/'rotated'); log.write_text('new\n')
        writer.write('after\n'); writer.flush()
    assert (root/'rotated').read_text()=='before\nafter\n'
    assert log.read_text()=='new\n'`, "local-real")
],
"CPU, memória e load": [
 p("Coleta real de load e memória; sem stress ou benchmark", String.raw`import os, pathlib
load=os.getloadavg()
assert len(load)==3 and all(value>=0 for value in load)
memory=pathlib.Path('/proc/meminfo').read_text()
assert 'MemTotal:' in memory
assert 'MemAvailable:' in memory`, "local-real"),
 p("Budget sintético de CPU respeita quota", String.raw`quota_us,period_us=50000,100000
effective_cores=quota_us/period_us
cpu_seconds,wall_seconds=.25,1
relative=cpu_seconds/(wall_seconds*effective_cores)
assert relative==.5
assert relative != cpu_seconds/(wall_seconds*8)`)
],
"Disco, I/O e inode pressure": [
 p("Consulta statvfs real, sem carga de I/O", String.raw`import os
storage=os.statvfs('.')
assert storage.f_frsize>0 and storage.f_blocks>0
assert storage.f_bavail>=0 and storage.f_favail>=0
available_bytes=storage.f_bavail*storage.f_frsize
assert available_bytes>=0`, "local-real"),
 p("Pressão de objetos e bytes são sinais distintos no modelo", String.raw`def pressure(bytes_free,bytes_total,inodes_free,inodes_total):
    if min(bytes_total,inodes_total)<=0: raise ValueError('invalid denominator')
    return bytes_free/bytes_total<.1 or inodes_free/inodes_total<.1
assert pressure(900,1000,1,100)
assert not pressure(900,1000,90,100)
try: pressure(0,0,1,10)
except ValueError: pass
else: raise AssertionError('zero accepted')`)
],
"Rede, conexões e latência": [
 p("Roundtrip real local; não benchmark externo", String.raw`import socket, threading, time
with socket.socket() as listener:
    listener.bind(('127.0.0.1',0)); listener.listen(); listener.settimeout(3)
    def echo():
        connection,_=listener.accept()
        with connection:
            connection.settimeout(3); connection.sendall(connection.recv(8))
    thread=threading.Thread(target=echo); thread.start()
    try:
        start=time.monotonic()
        with socket.create_connection(listener.getsockname(),timeout=3) as peer:
            peer.sendall(b'latency'); assert peer.recv(8)==b'latency'
        assert time.monotonic()-start>=0
    finally: thread.join(timeout=4)
    assert not thread.is_alive()`, "local-real"),
 p("Composição didática de deadlines", String.raw`budget_ms=200
def fits(parts): return all(value>=0 for value in parts.values()) and sum(parts.values())<=budget_ms
assert fits({'dns':10,'connect':20,'tls':30,'application':100})
assert not fits({'dns':10,'connect':20,'tls':30,'application':180})`)
],
"Métricas, alertas e SLO": [
 p("SLI e orçamento calculados sobre fixture", String.raw`from fractions import Fraction
objective=Fraction(999,1000)
def meets(success,total):
    if total<=0: raise ValueError('no observations')
    return Fraction(success,total)>=objective
assert meets(999,1000)
assert not meets(998,1000)
assert (1-objective)*10000==10`),
 p("Regra de alerta recusa telemetria ausente", String.raw`def classify(errors,total,telemetry):
    if not telemetry or total<=0: return 'unknown'
    return 'alert' if errors/total>.01 else 'healthy'
assert classify(0,100,True)=='healthy'
assert classify(5,100,True)=='alert'
assert classify(0,100,False)=='unknown'
assert classify(0,0,True)=='unknown'`)
],
"Namespaces, cgroups e limits": [
 p("Leitura real de namespaces e cgroup do processo", String.raw`import os, pathlib
namespaces={name:os.readlink('/proc/self/ns/'+name) for name in ('pid','mnt','net','user')}
assert all('[' in identity for identity in namespaces.values())
assert pathlib.Path('/proc/self/cgroup').read_text().strip()`, "local-real"),
 p("Quota didática valida unidades e denominador", String.raw`def cpu_capacity(quota,period):
    if quota<=0 or period<=0: raise ValueError('invalid quota')
    return quota/period
assert cpu_capacity(200000,100000)==2
try: cpu_capacity(10000,0)
except ValueError: pass
else: raise AssertionError('invalid period accepted')`)
],
"Rootless e user namespaces": [
 p("Leitura real dos mapas sem criar namespace", String.raw`from pathlib import Path
for filename in ('uid_map','gid_map'):
    mappings=[tuple(map(int,line.split())) for line in Path('/proc/self/'+filename).read_text().splitlines()]
    assert mappings and all(len(item)==3 and item[2]>0 for item in mappings)`, "local-real"),
 p("Tradução sintética de UID; sem aplicar mapping", String.raw`def outside_uid(inside,start,count):
    if not 0<=inside<count: raise ValueError('unmapped')
    return start+inside
assert outside_uid(0,100000,65536)==100000
assert outside_uid(7,100000,65536)==100007
try: outside_uid(70000,100000,65536)
except ValueError: pass
else: raise AssertionError('unmapped UID accepted')`)
],
"Seccomp, AppArmor e SELinux": [
 p("Indicadores reais de proc; não prova policy aplicada à aplicação", String.raw`from pathlib import Path
status=Path('/proc/self/status').read_text().splitlines()
fields=dict(line.split(':',1) for line in status if ':' in line)
assert int(fields['Seccomp'].strip()) in (0,1,2)
assert int(fields['NoNewPrivs'].strip()) in (0,1)`, "local-real"),
 p("Modelo de operações permitidas, não sintaxe de LSM", String.raw`policy={('read','config'),('write','state')}
assert ('read','config') in policy
assert ('write','code') not in policy
assert ('read','other-tenant-secret') not in policy`)
],
"Imagens, volumes e runtime": [
 p("Manifesto didático fixa artefato e proíbe socket administrativo", String.raw`def image_valid(manifest):
    return manifest['image'].startswith('sha256:') and '/var/run/docker.sock' not in manifest['mounts']
assert image_valid({'image':'sha256:'+'a'*64,'mounts':['state-volume']})
assert not image_valid({'image':'latest','mounts':['state-volume']})
assert not image_valid({'image':'sha256:'+'a'*64,'mounts':['/var/run/docker.sock']})`),
 p("Estado de arquivo conserva-se separado de artefato; sem container", String.raw`import pathlib, tempfile
with tempfile.TemporaryDirectory() as directory:
    root=pathlib.Path(directory)
    image=root/'artifact'; state=root/'state'
    image.write_text('version-1'); state.write_text('reservation-1')
    image.write_text('version-2')
    assert state.read_text()=='reservation-1'
    assert image.read_text()=='version-2'`, "local-real")
],
"Atualizações e rollback": [
 b("Versões locais consultadas sem manutenção do host", String.raw`set -eu
dpkg-query -W -f='\${Package} \${Version}\n' bash coreutils >package-baseline.txt
test "$(wc -l <package-baseline.txt)" -eq 2
grep '^bash ' package-baseline.txt >/dev/null`),
 p("Matriz sintética de rollback e schema", String.raw`compatibility={'v1':{1},'v2':{1,2}}
def can_run(version,schema): return schema in compatibility[version]
assert can_run('v2',2)
assert can_run('v1',1)
assert not can_run('v1',2)`)
],
"Hardening e baseline": [
 p("Auditoria real de modos em arquivos efêmeros", String.raw`import pathlib, tempfile
with tempfile.TemporaryDirectory() as directory:
    root=pathlib.Path(directory)
    good=root/'good'; bad=root/'bad'
    good.touch(); bad.touch(); good.chmod(0o600); bad.chmod(0o666)
    def private(path): return path.stat().st_mode & 0o077 == 0
    assert private(good) and not private(bad)`, "local-real"),
 p("Drift de serviços em fixture; não desativa serviços", String.raw`baseline_services={'web','worker','monitor'}
observed_services={'web','worker','monitor','unexpected-listener'}
extra=observed_services-baseline_services
assert extra=={'unexpected-listener'}
assert not (baseline_services-observed_services)`)
],
"Secrets, cryptography e audit": [
 p("Hash real detecta mudança de bytes; não prova autenticidade", String.raw`import hashlib
approved=b'approved-config'
digest=hashlib.sha256(approved).hexdigest()
assert hashlib.sha256(approved).hexdigest()==digest
assert hashlib.sha256(b'changed-config').hexdigest()!=digest`, "local-real"),
 p("Evento didático de rotação sem material secreto", String.raw`import json
rotation={'credential_id':'fixture-key-2','owner':'worker','secret':'FIXTURE-PRIVATE','action':'rotate'}
report={key:value for key,value in rotation.items() if key!='secret'}
text=json.dumps(report)
assert 'FIXTURE-PRIVATE' not in text
assert report['credential_id']=='fixture-key-2'
assert report['action']=='rotate'`)
],
"Vulnerabilidades e resposta": [
 p("Aplicabilidade didática; versões e falha são fictícias", String.raw`fixed={'fixture-package':'fixture-fixed'}
def triage(package,version):
    if package not in fixed: return 'unknown'
    return 'fixed' if version==fixed[package] else 'investigate'
assert triage('fixture-package','fixture-fixed')=='fixed'
assert triage('fixture-package','fixture-old')=='investigate'
assert triage('unobserved','anything')=='unknown'`),
 p("Encerramento sintético exige evidência e mitigação vigente", String.raw`def closable(case):
    return case['evidence'] and (case['patched'] or (case['mitigated'] and not case['expired']))
case={'evidence':True,'patched':False,'mitigated':True,'expired':False}
assert closable(case)
assert not closable({**case,'expired':True})
assert not closable({**case,'evidence':False})`)
],
"NTP, DNS e configuração": [
 p("Relógios reais para formatos e duração; sem fonte NTP", String.raw`import time, datetime
start=time.monotonic_ns(); end=time.monotonic_ns()
assert end>=start
wall=datetime.datetime.now(datetime.timezone.utc).isoformat()
assert datetime.datetime.fromisoformat(wall).tzinfo is not None`, "local-real"),
 p("Convergência e skew em inventário sintético", String.raw`def converged(nodes):
    return all(node['config']=='c2' and abs(node['skew_ms'])<=50 for node in nodes)
assert converged([{'config':'c2','skew_ms':10}])
assert not converged([{'config':'c1','skew_ms':10}])
assert not converged([{'config':'c2','skew_ms':90}])`)
],
"HA, quorum e fencing": [
 p("Maioria aritmética; não implementa consenso", String.raw`def majority(votes,members): return 0<=votes<=members and votes>members//2
assert majority(2,3)
assert not majority(1,3)
assert majority(3,5)
assert not majority(2,5)`),
 p("Fencing token local modelado; não bloqueia host", String.raw`current_token=8
def write_allowed(token): return token==current_token
assert write_allowed(8)
assert not write_allowed(7)
assert not write_allowed(9)`)
],
"Filas, workers e backpressure": [
 p("Backlog e drenagem calculados sobre taxas sintéticas", String.raw`backlog,arrival,service,seconds=100,12,10,5
after=backlog+(arrival-service)*seconds
assert after==110
drain_rate=20-12
assert drain_rate>0
assert after/drain_rate==13.75`),
 p("Deduplicação local em memória; sem broker ou durabilidade", String.raw`applied=set(); effects=[]
def consume(identity):
    if identity in applied: return False
    effects.append(identity); applied.add(identity); return True
assert consume('message-1')
assert not consume('message-1')
assert effects==['message-1']`)
],
"Incidentes e comunicação": [
 p("Contrato de atualização; nenhuma mensagem é enviada", String.raw`required={'impact','known','next_action','owner'}
update={'impact':'reservations degraded','known':['errors observed'],'next_action':'inspect dependency','owner':'coordinator'}
assert required<=update.keys()
assert not required<={'impact','known','owner'}`),
 p("Cronologia sintética distingue fato de hipótese", String.raw`timeline=[{'time':1,'kind':'fact','text':'probe failed'},{'time':2,'kind':'hypothesis','text':'database unavailable'},{'time':3,'kind':'fact','text':'rollback started'}]
facts=[event['text'] for event in timeline if event['kind']=='fact']
assert facts==['probe failed','rollback started']
assert 'database unavailable' not in facts
assert timeline==sorted(timeline,key=lambda event:event['time'])`)
],
"Cloud-init e imagens": [
 b("Schema cloud-init nativo; sem VM ou primeira partida", String.raw`set -eu
cat >cloud-config.yaml <<'CONFIG'
#cloud-config
{"write_files":[{"path":"/tmp/chiron-fixture","content":"fixture","permissions":"0600"}]}
CONFIG
cloud-init schema --config-file cloud-config.yaml`, "native-config"),
 p("Manifesto de imagem sem identidade persistida", String.raw`def clean_image(manifest):
    return manifest['artifact'] and not any(key in manifest for key in ('machine_id','private_host_key','token'))
assert clean_image({'artifact':'fixture-image-1'})
assert not clean_image({'artifact':'fixture-image-1','machine_id':'copied'})
assert not clean_image({'artifact':'fixture-image-1','token':'private'})`)
],
"Ansible e estado desejado": [
 p("Convergência real de conteúdo e modo; não executa Ansible", String.raw`import pathlib, tempfile
def ensure(path):
    changed=not path.exists() or path.read_text()!='desired' or path.stat().st_mode & 0o777 != 0o600
    if changed: path.write_text('desired'); path.chmod(0o600)
    return changed
with tempfile.TemporaryDirectory() as directory:
    path=pathlib.Path(directory)/'managed'
    assert ensure(path)
    assert not ensure(path)
    path.chmod(0o644); assert ensure(path)`, "local-real"),
 p("Inventário didático recusa ambiente fora do escopo", String.raw`def authorized_target(target): return target['environment']=='lab' and target['principal']=='lab-deployer'
assert authorized_target({'environment':'lab','principal':'lab-deployer'})
assert not authorized_target({'environment':'production','principal':'lab-deployer'})
assert not authorized_target({'environment':'lab','principal':'unknown'})`)
],
"CI, artifacts e promoção": [
 p("Promoção local preserva bytes do artefato; sem CI remoto", String.raw`import hashlib, pathlib, shutil, tempfile
with tempfile.TemporaryDirectory() as directory:
    root=pathlib.Path(directory); built=root/'built'; promoted=root/'promoted'
    built.write_bytes(b'fixture-release-artifact')
    digest=hashlib.sha256(built.read_bytes()).hexdigest()
    shutil.copyfile(built,promoted)
    assert hashlib.sha256(promoted.read_bytes()).hexdigest()==digest`, "local-real"),
 p("Autorização didática liga commit, digest e ambiente", String.raw`approved={'commit':'fixture-sha','digest':'fixture-digest','environment':'lab'}
def promotable(candidate): return candidate==approved
assert promotable(dict(approved))
assert not promotable({**approved,'digest':'changed'})
assert not promotable({**approved,'environment':'production'})`)
],
"Drift, approval e rollback": [
 p("Diff de configuração sintética com campos relevantes", String.raw`expected={'workers':2,'timeout_ms':200,'release':'r1'}
observed={'workers':3,'timeout_ms':200,'release':'r2'}
drift={key:(value,observed.get(key)) for key,value in expected.items() if observed.get(key)!=value}
assert drift=={'workers':(2,3),'release':('r1','r2')}
assert 'timeout_ms' not in drift`),
 p("Approval modelado não vale para candidato alterado", String.raw`import hashlib, json
def proposal_digest(proposal): return hashlib.sha256(json.dumps(proposal,sort_keys=True).encode()).hexdigest()
proposal={'target':'lab','release':'r2'}
approved_digest=proposal_digest(proposal)
assert proposal_digest(dict(proposal))==approved_digest
assert proposal_digest({**proposal,'release':'r3'})!=approved_digest`)
],
"RPO, RTO e topology": [
 p("RPO observado sobre datas fixas de fixture", String.raw`from datetime import datetime,timedelta,timezone
failure=datetime(2026,10,1,12,tzinfo=timezone.utc)
latest_usable=failure-timedelta(minutes=12)
objective=timedelta(minutes=15)
assert failure-latest_usable<=objective
assert failure-(failure-timedelta(minutes=20))>objective`),
 p("RTO inclui validação e reconciliação no modelo", String.raw`steps={'access':20,'transfer':40,'restore':60,'validate':30,'reconcile':20}
objective_seconds=180
assert sum(steps.values())==170
assert sum(steps.values())<=objective_seconds
assert sum({**steps,'reconcile':40}.values())>objective_seconds`)
],
"Restore de serviço e dados": [
 p("Dados de fixture restaurados e invariantes verificados", String.raw`import json, pathlib, tempfile
with tempfile.TemporaryDirectory() as directory:
    restored=pathlib.Path(directory)/'restored.json'
    restored.write_text(json.dumps({'capacity':2,'reservations':['a','b']}))
    data=json.loads(restored.read_text())
    assert len(data['reservations'])<=data['capacity']
    assert len(set(data['reservations']))==len(data['reservations'])`, "local-real"),
 p("Compatibilidade de restore em matriz sintética", String.raw`supported_schemas={'restore-app-v1':{1},'restore-app-v2':{1,2}}
assert 2 in supported_schemas['restore-app-v2']
assert 2 not in supported_schemas['restore-app-v1']
assert 1 in supported_schemas['restore-app-v1']`)
],
"Game days e evidência": [
 p("Pacote sintético exige executor e cleanup; sem game day real", String.raw`def complete(report):
    return all(report.get(key) for key in ('executor','version','input_digest','result','cleanup'))
report={'executor':'fixture-runner','version':'1','input_digest':'fixture','result':'observed','cleanup':'done'}
assert complete(report)
assert not complete({**report,'cleanup':''})
assert not complete({**report,'executor':''})`),
 p("Oracle local mata mutante que excede capacidade", String.raw`def invariant(capacity,reservations): return len(reservations)<=capacity and len(set(reservations))==len(reservations)
assert invariant(1,['a'])
assert not invariant(1,['a','b'])
assert not invariant(2,['a','a'])`)
],
"Postmortem e ações verificáveis": [
 p("Ação didática exige aceite concreto", String.raw`def actionable(action):
    return bool(action.get('owner') and action.get('due') and action.get('acceptance_test'))
assert actionable({'owner':'team','due':'fixture-date','acceptance_test':'reject duplicate reservation'})
assert not actionable({'owner':'team','due':'fixture-date','description':'be more careful'})`),
 p("Cenário antes/depois local torna correção sensível", String.raw`def old_handler(seen,identity): seen.append(identity)
def corrected_handler(seen,identity):
    if identity not in seen: seen.append(identity)
old=[]; new=[]
for identity in ['request-1','request-1']:
    old_handler(old,identity); corrected_handler(new,identity)
assert len(old)!=1
assert len(new)==1`)
],
"Baseline de host e deploy": [
 b("Baseline real limitado ao WSL; sem deploy do serviço", String.raw`set -eu
uname -s >baseline-kernel.txt
grep '^ID=' /etc/os-release >baseline-distribution.txt
findmnt -n -o FSTYPE -T / >baseline-filesystem.txt
test -s baseline-kernel.txt
test -s baseline-distribution.txt
test -s baseline-filesystem.txt`),
 p("Publicação real de referência local; sem runtime Quíron", String.raw`import hashlib, os, pathlib, tempfile
with tempfile.TemporaryDirectory() as directory:
    root=pathlib.Path(directory); artifact=root/'release-r2'
    artifact.write_bytes(b'quiron-fixture-r2')
    approved=hashlib.sha256(artifact.read_bytes()).hexdigest()
    candidate=root/'candidate'; candidate.symlink_to(artifact)
    os.replace(candidate,root/'current')
    assert hashlib.sha256((root/'current').read_bytes()).hexdigest()==approved`, "local-real")
],
"Reserva concorrente e outbox": [
 p("Concorrência real de threads e lock local; sem banco", String.raw`import threading
lock=threading.Lock(); barrier=threading.Barrier(2); reservations=[]
def reserve(identity):
    barrier.wait(timeout=3)
    with lock:
        if len(reservations)<1: reservations.append(identity)
workers=[threading.Thread(target=reserve,args=(identity,)) for identity in ('a','b')]
for worker in workers: worker.start()
for worker in workers: worker.join(timeout=4)
assert not any(worker.is_alive() for worker in workers)
assert len(reservations)==1`, "local-real"),
 p("Replay local de outbox em memória; sem durabilidade", String.raw`outbox=[{'id':'event-1','reservation':'reserve-1'}]
applied_events=set(); effects=[]
for event in outbox+outbox:
    if event['id'] not in applied_events:
        effects.append(event['reservation']); applied_events.add(event['id'])
assert effects==['reserve-1']
assert applied_events=={'event-1'}`)
],
"Release, canary e observação": [
 p("Decisão de canary sobre fixture exige invariante", String.raw`def advance(observation):
    return observation['total']>=100 and observation['errors']/observation['total']<=.01 and observation['stock']>=0
good={'total':100,'errors':0,'stock':1}
assert advance(good)
assert not advance({**good,'stock':-1})
assert not advance({**good,'total':10})`),
 p("Identidade de artefato observada localmente; sem endpoint", String.raw`import hashlib
approved_payload=b'canary-approved'
expected_digest=hashlib.sha256(approved_payload).hexdigest()
observed_payload=b'canary-approved'
assert hashlib.sha256(observed_payload).hexdigest()==expected_digest
assert hashlib.sha256(b'canary-other').hexdigest()!=expected_digest`)
],
"Banca de incidente e restore": [
 p("Ledger de fixture em arquivo e oracle de reconciliação", String.raw`import json, pathlib, tempfile
with tempfile.TemporaryDirectory() as directory:
    ledger=pathlib.Path(directory)/'ledger'
    ledger.write_text(json.dumps({'capacity':1,'reservations':['r1'],'events':[{'reservation':'r1'}]}))
    recovered=json.loads(ledger.read_text())
    assert len(recovered['reservations'])<=recovered['capacity']
    assert {event['reservation'] for event in recovered['events']}==set(recovered['reservations'])`, "local-real"),
 p("Relatório recusa falsa aprovação operacional", String.raw`def honest(gates):
    return all(gate['status']!='Approved' or gate['executed'] for gate in gates)
gates=[{'name':'local-model','status':'Approved','executed':True},{'name':'boot','status':'Pending','executed':False}]
assert honest(gates)
assert not honest([{'name':'real-firewall','status':'Approved','executed':False}])`)
]
};
