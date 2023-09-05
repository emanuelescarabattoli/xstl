<img src="./wrapper/build/icons/icon_256x256.png" alt="Xstl" width="128"/>

# Xstl, a free and open-source STL viewer

Xstl is a free and open-source STL viewer for Linux and Windows, build with modern tools, Electron and React. With Xstl you can open an STL file and navigate trough a directory to see all the STL files on it, buy using buttons or with a shortcut (`alt+z` and `alt+x`). The default view is isometric, so you can see all the details of your model.

<img src="./docs/assets/images/screen-main.png" alt="Settings"/>

## Settings and customization

By changing the default settings you can visualized your model in different colors. The bed is configurable/switchable too.

<img src="./docs/assets/images/screen-settings.png" alt="Settings"/>

## Install

To install Xstl, check the releases page https://github.com/emanuelescarabattoli/xstl/releases

## Set as default program

To set Xstl as default STL files viewer on Windows:

- Double-click on a `.stl` file
- Select "Open with another program"
- Navigate to `C:\Users\<your user>\AppData\Local\Programs\Xstl` folder
- Select `Xstl.exe`

To set Xstl as default STL files viewer on Linux:

- Double-click on a `.stl` file
- In the window that will open, search for "Xstl" and select it

## Build instructions

Here the instructions to build the project:

- Change the version in `./xstl/wrapper/package.json`, if you want to perform a release

- Navigate to xtl code folder, wrapper sub-directory
```
cd ./xstl/wrapper
```
- Install packages using yarn
```
yarn install
```
- To build deb package
```
yarn build-deb
```
- To build AppImage package
```
yarn build-app-image

```
- To build Windows setup package
```
yarn build-win

```

## Local setup

To run the project locally, after cloning it, do the following

- Open a terminal, navigate to the frontend directory and install dependencies using yarn
```
cd frontned
yarn install
```
- Run the React project
```
yarn start
```
- You can close the browser tab that will open up
- In another terminal, navigate to the electron application directory and install dependencies using yarn
```
cd wrapper
yarn install
```
- Run the project
```
yarn start
```
- Now the application is running locally

## Contribute

Feel free yo contribute to this project here https://github.com/emanuelescarabattoli/xstl/pulls or open an issue here https://github.com/emanuelescarabattoli/xstl/issues

## License

Licensed under the MIT license.
