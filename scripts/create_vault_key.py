#!/usr/bin/env python3

from pathlib import Path
from publish_tools import ansible_utils

root_directory = Path(__file__).parent.parent

ansible_utils.create_vault_key(root_directory / '.ansible/vault_key')
