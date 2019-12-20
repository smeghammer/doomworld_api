# doomworld_api

A sample Javascript/REST based web application with PHP proxy that uses the Doomworld public API. The client-side code uses incremental AJAX REST calls to retrieve and build branches of the IDGAMES mirror.

## Summary
 - a (very) simple PHP proxy
 - single page display, driven by JQuery/JS/CSS
 - incremental build of tree based on nodes clicked and AJAX calls via proxy to Doomworld API
 - uses standard JQuery and FontAwesome libs
 
## Planned additions
  - I will add more link options to each branch - back to Doomworld
  - display full details of selected file in RH window or overlay (from a link option above)
  - better management of FTP links for direct downloads
  - store/replay/export of click history so we can re-open a given section on hard reload