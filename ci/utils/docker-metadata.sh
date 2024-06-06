#!/bin/ash
# shellcheck shell=dash

put_tag() {
	echo "--tag $CI_REGISTRY_IMAGE:$1"
	echo "--tag $DOCKERHUB_REGISTRY_IMAGE:$1"
	echo "--tag $GITHUB_REGISTRY_IMAGE:$1"
}

if [ -n "${CI_COMMIT_TAG}" ]; then
	put_tag "${CI_COMMIT_TAG}"
	if echo "${CI_COMMIT_TAG}" | grep -qvE '^.*(beta|alpha).*'; then
		put_tag "latest"
	fi
else
	if [ "${CI_PIPELINE_SOURCE}" != "merge_request_event" ]; then
		put_tag "edge"
	fi
fi

echo "--tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
echo "--tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"
