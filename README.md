# ims-resolver

This ims resolver consumes from the AWS SQS (Simple Queue Service) and posts from the queue to the ims system

## Git Tags and Release Workflow

This repository uses Git tags to trigger the release pipeline, build container images, and push them to the Quay.io container registry.

#### Workflow Overview

Developers push a Git tag following Semantic Versioning (e.g., 1.0.0).

The Drone CI pipeline is automatically triggered only when the tag is pushed from the master branch.

A Docker image is built and pushed to Quay.io.

The image is tagged with:

the semantic version (e.g., 1.0.0)

a content-addressable digest (@sha256:...)

The complete image reference can be used in the format:
**quay.io/yourorg/your-image:1.0.0@sha256:<digest>**

**Tagging for Releases**

To release a new version, follow these steps on the master branch only:

**Make sure you're on the master branch**

git checkout master

**Create and push a semantic version tag**

git tag 1.2.3
git push origin 1.2.3

**Alternatively,** We can create Tags from Git Hosting UI instead of CLI commands

We can also create tags directly from Git hosting provider’s web interface e.g., GitHub

Go to the Releases or Tags section of the repository

Click "Create a new release" or "Add tag"

Use the proper version format (e.g., 1.2.3) and make sure it points to the master branch

This is a convenient way for team members to trigger a release without using the command line.


###  Release Tagging Guidelines for Contributors

When creating a new Git tag (either via CLI or Git UI), please follow these practices to ensure clear, traceable, and production-ready releases:

Attach release notes or changelogs to a tag

Link to issues, PRs, and milestones

Create pre-releases for testing before full deployment

This turns a simple tag into a full-fledged release artifact.


**Important:**

Use valid Semantic Versioning format: v<MAJOR>.<MINOR>.<PATCH> (e.g., 1.0.0, 2.3.1)

The Drone CI pipeline is configured to only trigger on tags created from the master branch.

#### Reason for Usage of image:tag@digest

The format image:tag@digest combines:

Tag (human-readable version, like 1.2.3)

Digest (immutable SHA-256 content identifier)

The digest SHA (sha256:<digest>) is a cryptographic hash that uniquely identifies the image content. You can retrieve it from Quay.io after the image is pushed:

**This guarantees:**

'Consistency' – The image always resolves to the same content.

'Traceability' – You can trace exactly which build and source it came from.

'Security' – Prevents tampering or tag overwriting in registries.
