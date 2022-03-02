#!/bin/sh
cd Insitux/src
cp index.ts parse.ts test.ts types.ts checks.ts val.ts closure.ts ../../rbxts-Insitux/src
cd ..
cd ../rbxts-Insitux/src
prettier --write  --trailing-comma all *
