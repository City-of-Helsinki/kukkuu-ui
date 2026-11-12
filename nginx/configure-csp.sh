#!/bin/bash
set -euo pipefail

CSP_REPORT_DIRECTIVES=""
REPORTING_ENDPOINTS=""

if [[ -n "${VITE_CSP_REPORT_URI:-}" ]]; then
    if [[ ! "$VITE_CSP_REPORT_URI" =~ ^https://[A-Za-z0-9.-]+(:[0-9]+)?(/[A-Za-z0-9._~%/?\&=+,:@-]*)?$ ]]; then
        echo "VITE_CSP_REPORT_URI must be an HTTPS URL without nginx configuration characters." >&2
        exit 1
    fi
    CSP_REPORT_DIRECTIVES="report-uri $VITE_CSP_REPORT_URI; report-to csp-endpoint;"
    REPORTING_ENDPOINTS="csp-endpoint=\"$VITE_CSP_REPORT_URI\""
fi

export CSP_REPORT_DIRECTIVES REPORTING_ENDPOINTS
envsubst '${CSP_REPORT_DIRECTIVES} ${REPORTING_ENDPOINTS}' \
    < /etc/nginx/templates/security-headers.conf.template \
    > /etc/nginx/headers.d/security-headers.conf