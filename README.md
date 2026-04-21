# be-web-trii
Run project
```
    pip install -r .\requirements.txt
    granian --interface asgi --reload --port 8081 main:app
    python3 -m pip install -r requirements.txt
```

## fix commit

```
    pre-commit run --show-diff-on-failure --color=always --all-files
    black .
```

## DB migrations
```
    py -m alembic revision --autogenerate -m "init"
    py -m alembic upgrade head
```

## Manual deploy
```
    docker build -t gcr.io/trii-dev-325214/be-web-trii:v1.1 --ssh default=KEY_SSH_FILE .
    docker push gcr.io/trii-dev-325214/be-web-trii:v1.1
    gcloud run deploy be-web-trii --region=us-east1 --port=80 --image gcr.io/trii-dev-325214/be-web-trii:v1.1
```

### Run local
```
    docker build -t gcr.io/trii-dev-325214/be-web-trii:v1.1 .
    docker run gcr.io/trii-dev-325214/be-web-trii:v1.1
    docker run -d -p 80 gcr.io/trii-dev-325214/be-web-trii:v1.1
    docker run -p 80 gcr.io/trii-dev-325214/be-web-trii:v1.1
```

### Pre-commit

> Ref: https://pre-commit.com/

- Option 1: Using PIP

```bash
pip install pre-commit
```

Non-administrative installation:

```bash
curl https://pre-commit.com/install-local.py | python -
```

- Option 2: Using homebrew (Recommended)

```bash
brew install pre-commit
```

Add the recommended setup in the local environment

```bash
pre-commit install
```

_Now, the checks will be executed when a new commit is created_

> Expected: The list of checks with the result
```bash
Python formatter.....................................(no files to check)Skipped
JS linter............................................(no files to check)Skipped
```
⚠️ _After activating the git hooks, the validations will always be executed before each commit.
The validations could be bypassed using the flag `--no-verify` but this action is not recommended_ ⚠️
```bash
git commit --no-verify
```

After install pre-commit, in each commit starts the pre-commit validation:
```
git add .
git commit -m "test..."
```
