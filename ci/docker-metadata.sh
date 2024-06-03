function put_tag {
	echo "--tag $CI_REGISTRY_IMAGE:$1"
	echo "--tag $DOCKERHUB_REGISTRY_IMAGE:$1"
	echo "--tag $GITHUB_REGISTRY_IMAGE:$1"
}

if [[ -n "${CI_COMMIT_TAG}" ]]; then
	put_tag "${CI_COMMIT_TAG}"
	if [[ "${CI_COMMIT_TAG}" != *"beta"* && "${CI_COMMIT_TAG}" != *"alpha"* ]]; then
		put_tag "latest"
	fi
else
	put_tag "edge"
fi

echo "--tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
echo "--tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA"
echo "--tag $CI_REGISTRY_IMAGE:$CI_COMMIT_REF_SLUG"
