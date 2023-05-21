#!/usr/bin/env python3

from pathlib import Path
import sys
from kubetools.docker_utils import build_and_push_docker_img

root_directory = Path(__file__).parent.parent
github_access_token = sys.argv[1]
docker_username = sys.argv[2]
docker_password = sys.argv[3]

if not github_access_token:
    print('GitHub access token is missing', flush=True, file=sys.stderr)
    exit(1)

build_and_push_docker_img(
    src=root_directory,
    tag_prefix='server',
    image_name='mucsi96/postgres-backup-tool',
    docker_username=docker_username,
    docker_password=docker_password,
    github_access_token=github_access_token
)