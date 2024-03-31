export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
export TESTCONTAINERS_RYUK_DISABLED=true
export DOCKER_NETWORK=$(docker container inspect "$(hostname)" --format='{{range $key,$value := .NetworkSettings.Networks}}{{$key}}{{end}}')
