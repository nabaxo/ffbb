# FFic BBang - A tool for organising bang events for fanfic communities.

This is the source code, enjoy! It's built with React, Create-React-App, TypeScript, and Firebase.

## Instructions

If you wanna run it yourself, follow these steps.

1. Create a Firebase web-app
2. Clone the repo
3. Create src/firebaseConfig.ts with content like this:
    ```typescript
    export var firebaseConfig = {
        apiKey: "",
        authDomain: "",
        databaseURL: "",
        projectId: "",
        storageBucket: "",
        messagingSenderId: "",
        appId: ""
    }
    ```
4. Run `npm install`
5. Run `npm start`
6. Enjoy!

**_NOTE_: If you want the Github Action to work, you need to add the contents of the firebaseConfig.ts to a Github secret named FIREBASE_CONFIG.**

## More stuff

Since this is based on Create React App, you have the usual available scripts to you, like:

- `npm start`
- `npm test`
- `npm build`
- `npm eject` (Don't do this unless you know what you're doing!)

Please refer to the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) for more information!

## Credits

- [Nebez 'nabaxo' Kassem](https://nabaxo.io)

## License

FFic Bbang is open source software [licensed as GPLv3](https://github.com/nabaxo/ffbb/blob/main/LICENSE).
