cd %~dp0..\server
cargo build --release 
move .\target\release\control-center-server.exe ..\client\resources\server
del  .\target /Q
..\client\resources\server