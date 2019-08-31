#!/usr/bin/env python
#
# Copyright 2019 The Oppia Authors. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the 'License');
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an 'AS-IS' BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Post-checkout hook that reverts changes to package-lock.json.

To install the hook manually simply execute this script from the oppia root dir
with the `--install` flag.
To bypass the validation upon `git checkout` use the following command:
`git commit --no-verify --am "<Your Commit Message>"`

This hook works only on Unix like systems as of now.
On Vagrant under Windows it will still copy the hook to the .git/hooks dir
but it will have no effect.
"""

from __future__ import absolute_import  # pylint: disable=import-only-modules

import argparse
import collections
import os
import pprint
import shutil
import subprocess
import sys

# `pre_push_hook.py` is symlinked into `/.git/hooks`, so we explicitly import
# the current working directory so that Git knows where to find python_utils.
sys.path.append(os.getcwd())
import python_utils  # isort:skip  # pylint: disable=wrong-import-position


def _install_hook():
    """Installs the pre_commit_hook script and makes it executable.
    It ensures that oppia/ is the root folder.

    Raises:
        ValueError if chmod command fails.
    """
    oppia_dir = os.getcwd()
    hooks_dir = os.path.join(oppia_dir, '.git', 'hooks')
    post_checkout_file = os.path.join(hooks_dir, 'post-checkout')
    chmod_cmd = ['chmod', '+x', post_checkout_file]
    if os.path.islink(post_checkout_file):
        python_utils.PRINT('Symlink already exists')
    else:
        try:
            os.symlink(os.path.abspath(__file__), post_checkout_file)
            python_utils.PRINT('Created symlink in .git/hooks directory')
        # Raises AttributeError on windows, OSError added as failsafe.
        except (OSError, AttributeError):
            shutil.copy(__file__, post_checkout_file)
            python_utils.PRINT('Copied file to .git/hooks directory')

    python_utils.PRINT('Making post-checkout hook file executable ...')
    _, err_chmod_cmd = _start_subprocess_for_result(chmod_cmd)

    if not err_chmod_cmd:
        python_utils.PRINT('post-checkout hook file is now executable!')
    else:
        raise ValueError(err_chmod_cmd)


def _start_subprocess_for_result(cmd):
    """Starts subprocess and returns (stdout, stderr)."""
    task = subprocess.Popen(cmd, stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE)
    out, err = task.communicate()
    return out, err


def _revert_changes_in_package_lock_file():
    """Reverts the changes made in package-lock.json file.

    Raises:
        ValueError if any git command fails.
    """

    git_revert_cmd = ['git', 'checkout', '--', 'package-lock.json']

    _, err_revert_cmd = (
        _start_subprocess_for_result(git_revert_cmd))

    if not err_revert_cmd:
       python_utils.PRINT(
            'Changes to package-lock.json successfully reverted!')
    else:
        raise ValueError(err_revert_cmd)


def _does_diff_include_package_lock_file_and_no_package_file():
    """Checks whether the diff includes package-lock.json and
        no package.json.

    Returns:
        bool. Whether the diff includes package-lock.json and
            no package.json.

    Raises:
        ValueError if git command fails.
    """

    git_cmd = ['git', 'diff', '--name-only', '--cached']
    out, err = _start_subprocess_for_result(git_cmd)

    if not err:
        files_changed = out.split('\n')
        return 'package-lock.json' in files_changed and (
            'package.json' not in files_changed)
    else:
        raise ValueError(err)


def main():
    """Main method for post-checkout hook that checks files added/modified
    in a commit.
    """
    parser = argparse.ArgumentParser()
    parser.add_argument('--install', action='store_true', default=False,
                        help='Install post_checkout_hook to the .git/hooks dir')
    args = parser.parse_args()
    if args.install:
        _install_hook()
        sys.exit(0)

    python_utils.PRINT('Running post-checkout check for package-lock.json ...')
    if _does_diff_include_package_lock_file_and_no_package_file():
        python_utils.PRINT(
            'This commit only changes package-lock.json without '
            'any change in package.json. Therefore changes in '
            'package-lock.json will be automatically reverted.')
        python_utils.PRINT('Reverting changes in package-lock.json ...')
        _revert_changes_in_package_lock_file()
    sys.exit(0)


if __name__ == '__main__':
    main()
