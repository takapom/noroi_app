Before declaring a task done:
1. Run `make test` (same as `go test -v ./...`).
2. If DB/schema changes, run `make migrate-up` inside docker to validate migrations.
3. For containerized features, run `make docker-up` and ensure API + db start, then `make docker-down` after verification.
4. Update docs (README/API docs) when endpoints or workflows change.
5. Confirm `.env` additions documented and `docker-compose.yml` updated as needed.