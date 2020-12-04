@echo off
pushd %~dp0

set hour=%time:~0,2%
if "%hour:~0,1%" == " " set hour=0%hour:~1,1%
@REM echo hour=%hour%
set min=%time:~3,2%
if "%min:~0,1%" == " " set min=0%min:~1,1%
@REM echo min=%min%
set secs=%time:~6,2%
if "%secs:~0,1%" == " " set secs=0%secs:~1,1%
@REM echo secs=%secs%
for /f "tokens=1-4 delims=/-. " %%i in ('date /t') do (call :set_date %%i %%j %%k %%l)
goto :end_set_date

:set_date
if "%1:~0,1%" gtr "9" shift
for /f "skip=1 tokens=2-4 delims=(-)" %%m in ('echo,^|date') do (set %%m=%1&set %%n=%2&set %%o=%3)
goto :eof

:end_set_date

@REM echo day in 'DD' format is %dd%; month in 'MM' format is %mm%; year in 'YYYY' format is %yy%

set filePath=blog-%yy%%mm%%dd%-%hour%%min%%secs%
@REM echo %filePath%
IF [%1] == [] goto paraerror
node tools/mdpage.js %1 %filePath% %2 %3 %4 %5
popd
goto :eof

:paraerror
echo It should defined a link.
