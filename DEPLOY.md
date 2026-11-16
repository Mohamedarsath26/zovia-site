# Deploying zovia.in

Eight steps, done once. After that, `git push` is the whole deployment.

---

## 1. Add the domain to Cloudflare

1. Sign up at <https://dash.cloudflare.com> (free plan).
2. **Add a domain** -> type `zovia.in` -> choose **Free**.
3. Cloudflare scans existing records, then shows **two nameservers**, like:

   ```
   dana.ns.cloudflare.com
   rob.ns.cloudflare.com
   ```

Write them down. They are unique to your account.

## 2. Point BigRock at those nameservers

1. Log in to BigRock -> **My Orders** -> `zovia.in`.
2. Find **Name Servers** (sometimes under *DNS Management* or *Child Name Servers*).
3. Delete BigRock's defaults (`ns1.bigrock.in`, etc.) and enter Cloudflare's two.
4. Save.

Then wait. Cloudflare emails you when the domain is **Active**. Usually
15-60 minutes, occasionally up to 24 hours. Nothing below works until then.

## 3. Create the tunnel

1. Cloudflare dashboard -> **Zero Trust** -> **Networks** -> **Tunnels**.
2. **Create a tunnel** -> type **Cloudflared** -> name it `zovia-site`.
3. On the install screen choose the **Docker** tab.
4. You will see a long command containing a token. Copy **only the token** --
   the long string after `--token`. Do not run their command; compose runs it.

The token is a password for your tunnel. Never commit it.

## 4. Put the code and the token on the server

From your laptop:

```bash
ssh laptop "wsl -d Ubuntu-24.04 -- bash -lc 'cd ~/deployments && git clone https://github.com/Mohamedarsath26/zovia-site'"
```

Then create the `.env` file on the server, replacing `PASTE_TOKEN` with your
tunnel token.

`.env` is listed in `.gitignore`, so `git pull` will never overwrite it and it
can never be committed by accident.

## 5. Add the two GitHub secrets

```bash
gh secret set SSH_PRIVATE_KEY --repo Mohamedarsath26/zovia-site < %USERPROFILE%\.ssh\gha_deploy
```

```bash
gh secret set TS_AUTHKEY --repo Mohamedarsath26/zovia-site
```

The second prompts for the value. Paste your tagged, reusable, ephemeral
Tailscale auth key. Input is hidden on purpose.

## 6. Run the first deploy

```bash
gh workflow run deploy.yml --repo Mohamedarsath26/zovia-site
```

```bash
gh run watch --repo Mohamedarsath26/zovia-site
```

The job connects to Tailscale, SSHes into Windows, and runs
`docker compose up -d --build` inside WSL.

## 7. Point the hostname at the container

Back in **Zero Trust -> Networks -> Tunnels -> zovia-site -> Public Hostname**:

| Field | Value |
|---|---|
| Subdomain | *(leave empty)* |
| Domain | `zovia.in` |
| Service type | `HTTP` |
| URL | `web:80` |

Save. Add a second hostname with subdomain `www` and the same service.

`web:80` is the container's name on the private compose network. It is not a
port on your laptop -- nothing is published to the host at all.

## 8. Verify, then prove the pipeline

```bash
curl -I https://zovia.in
```

Expect `HTTP/2 200` and `server: cloudflare`.

Now edit `src/version.js`, change `'1'` to `'2'`, commit and push. Watch the
badge on the live site change. That is the whole point of all this.

---

## Troubleshooting

**`Bad gateway` / error 502** -- cloudflared is up but cannot reach the app.
Check the service URL is `web:80`, not `localhost:80`.

```bash
ssh laptop "wsl -d Ubuntu-24.04 -- bash -lc 'cd ~/deployments/zovia-site && docker compose logs --tail=40 cloudflared'"
```

**Workflow fails at "Connect to Tailscale"** -- the auth key expired or
`TS_AUTHKEY` is missing. A missing GitHub secret becomes an empty string
silently; it never errors on its own.

**Site shows the old version** -- a stale browser cache. `nginx.conf` already
sends `no-cache` for `index.html`, so a hard reload settles it.

**DNS still shows BigRock** -- check with:

```bash
nslookup -type=ns zovia.in 8.8.8.8
```
