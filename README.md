# ims-resolver

This IMS resolver consumes messages from AWS SQS (Simple Queue Service) and submits them to IMS using SOAP. The integration is selected with `SEND_TO_VERINT`: when set to `true`, the resolver uses Verint Cloud; otherwise, it uses the existing EBSA-hosted integration.

A Node.js microservice that consumes messages from AWS SQS (Simple Queue Service) and posts them to the selected IMS integration via SOAP.

## How It Works

1. Listens for messages on a configured SQS queue
2. Parses each message and submits it to the configured integration
3. Successfully processed messages are automatically removed from the queue
4. Failed messages remain in the queue for retry

### EBSA-hosted integration

The existing EBSA-hosted integration creates a case, adds and populates read-only and editable eforms, handles additional people, and uploads file-vault attachments as IMS documents with case-linked notes.

### Verint Cloud integration

The Verint Cloud integration creates one populated form from the message's `EformFields`, adds receipt date and time fields, and attaches any File Vault documents to the form.

## Prerequisites

- Node.js >=24.14.0 <25.0.0
- AWS SQS queue configured
- IMS API endpoint (SOAP)
- Keycloak authentication (for file vault access)

## Running

```bash
# Production
yarn start

# Development (with dotenv)
yarn run start:dev

# Tests
yarn test

# Linting
yarn run test:lint
```

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
