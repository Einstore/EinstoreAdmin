#!/usr/bin/env sh

sed "s~REACT_APP_API_URL~$API_URL~" /src/index.html.raw > /src/index.html
sed "s~REACT_APP_PREFILLED_CREDENTIALS~$PREFILLED_CREDENTIALS~" /src/index.html.raw > /src/index.html
nginx -g "daemon off;"
