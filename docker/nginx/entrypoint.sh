#!/usr/bin/env sh

sed \
	-e "s~%REACT_APP_API_URL%~$API_URL~g" \
	-e "s~%REACT_APP_PREFILLED_CREDENTIALS%~$PREFILLED_CREDENTIALS~g" \
	-e "s~%REACT_APP_SENTRY_DSN%~$SENTRY_DSN~g" \
	/src/index.html > /src/index.html.raw

mv /src/index.html.raw /src/index.html

nginx -g "daemon off;"
