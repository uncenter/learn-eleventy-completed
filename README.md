# Learn Eleventy Completed

This repository stores the completed versions of lessons from the [Learn Eleventy](https://learn-eleventy.pages.dev/) tutorial course. Lesson archives are pushed to a [rolling release](https://github.com/uncenter/learn-eleventy-completed/releases/tag/rolling-release).

## Editing

To edit a lesson:

1. Switch to the [`completed` branch](https://github.com/uncenter/learn-eleventy-completed/tree/completed).
1. Obtain the commit hash for the commit *before* the commit for the lesson you want to change. Run `git rebase -i <commit-before-target>`.
   1. To edit the setup commit (e.g. for the `generate.yml` GitHub Actions workflow), run `git rebase -i --root`.
2. In the editor, change `pick` to `edit` for the target lesson commit.
3. *Make changes...*
4. When finished with your changes, run `git add .` and `git commit --amend`.
5. Continue with the rebase with `git rebase --continue`.
6. Force push to the branch (`git push --force`).

## History

The previous repository history has been moved to the [`archived` branch](https://github.com/uncenter/learn-eleventy-completed/tree/archived).