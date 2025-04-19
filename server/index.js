import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useState } from "react";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/icon?family=Material+Icons"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const logoDark = "/assets/logo-dark-pX2395Y0.svg";
const logoLight = "/assets/logo-light-CVbx2LBR.svg";
function Welcome() {
  return /* @__PURE__ */ jsx("main", { className: "flex items-center justify-center pt-16 pb-4", children: /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col items-center gap-16 min-h-0", children: [
    /* @__PURE__ */ jsx("header", { className: "flex flex-col items-center gap-9", children: /* @__PURE__ */ jsxs("div", { className: "w-[500px] max-w-[100vw] p-4", children: [
      /* @__PURE__ */ jsx(
        "img",
        {
          src: logoLight,
          alt: "React Router",
          className: "block w-full dark:hidden"
        }
      ),
      /* @__PURE__ */ jsx(
        "img",
        {
          src: logoDark,
          alt: "React Router",
          className: "hidden w-full dark:block"
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "max-w-[300px] w-full space-y-6 px-4", children: /* @__PURE__ */ jsxs("nav", { className: "rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4", children: [
      /* @__PURE__ */ jsx("p", { className: "leading-6 text-gray-700 dark:text-gray-200 text-center", children: "What's next?" }),
      /* @__PURE__ */ jsx("ul", { children: resources.map(({ href, text, icon }) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
        "a",
        {
          className: "group flex items-center gap-3 self-stretch p-3 leading-normal text-blue-700 hover:underline dark:text-blue-500",
          href,
          target: "_blank",
          rel: "noreferrer",
          children: [
            icon,
            text
          ]
        }
      ) }, href)) })
    ] }) })
  ] }) });
}
const resources = [
  {
    href: "https://reactrouter.com/docs",
    text: "React Router Docs",
    icon: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "20",
        viewBox: "0 0 20 20",
        fill: "none",
        className: "stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M9.99981 10.0751V9.99992M17.4688 17.4688C15.889 19.0485 11.2645 16.9853 7.13958 12.8604C3.01467 8.73546 0.951405 4.11091 2.53116 2.53116C4.11091 0.951405 8.73546 3.01467 12.8604 7.13958C16.9853 11.2645 19.0485 15.889 17.4688 17.4688ZM2.53132 17.4688C0.951566 15.8891 3.01483 11.2645 7.13974 7.13963C11.2647 3.01471 15.8892 0.951453 17.469 2.53121C19.0487 4.11096 16.9854 8.73551 12.8605 12.8604C8.73562 16.9853 4.11107 19.0486 2.53132 17.4688Z",
            strokeWidth: "1.5",
            strokeLinecap: "round"
          }
        )
      }
    )
  },
  {
    href: "https://rmx.as/discord",
    text: "Join Discord",
    icon: /* @__PURE__ */ jsx(
      "svg",
      {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "20",
        viewBox: "0 0 24 20",
        fill: "none",
        className: "stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300",
        children: /* @__PURE__ */ jsx(
          "path",
          {
            d: "M15.0686 1.25995L14.5477 1.17423L14.2913 1.63578C14.1754 1.84439 14.0545 2.08275 13.9422 2.31963C12.6461 2.16488 11.3406 2.16505 10.0445 2.32014C9.92822 2.08178 9.80478 1.84975 9.67412 1.62413L9.41449 1.17584L8.90333 1.25995C7.33547 1.51794 5.80717 1.99419 4.37748 2.66939L4.19 2.75793L4.07461 2.93019C1.23864 7.16437 0.46302 11.3053 0.838165 15.3924L0.868838 15.7266L1.13844 15.9264C2.81818 17.1714 4.68053 18.1233 6.68582 18.719L7.18892 18.8684L7.50166 18.4469C7.96179 17.8268 8.36504 17.1824 8.709 16.4944L8.71099 16.4904C10.8645 17.0471 13.128 17.0485 15.2821 16.4947C15.6261 17.1826 16.0293 17.8269 16.4892 18.4469L16.805 18.8725L17.3116 18.717C19.3056 18.105 21.1876 17.1751 22.8559 15.9238L23.1224 15.724L23.1528 15.3923C23.5873 10.6524 22.3579 6.53306 19.8947 2.90714L19.7759 2.73227L19.5833 2.64518C18.1437 1.99439 16.6386 1.51826 15.0686 1.25995ZM16.6074 10.7755L16.6074 10.7756C16.5934 11.6409 16.0212 12.1444 15.4783 12.1444C14.9297 12.1444 14.3493 11.6173 14.3493 10.7877C14.3493 9.94885 14.9378 9.41192 15.4783 9.41192C16.0471 9.41192 16.6209 9.93851 16.6074 10.7755ZM8.49373 12.1444C7.94513 12.1444 7.36471 11.6173 7.36471 10.7877C7.36471 9.94885 7.95323 9.41192 8.49373 9.41192C9.06038 9.41192 9.63892 9.93712 9.6417 10.7815C9.62517 11.6239 9.05462 12.1444 8.49373 12.1444Z",
            strokeWidth: "1.5"
          }
        )
      }
    )
  }
];
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Welcome, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function WordleGame() {
  const MAX_ATTEMPTS = 5;
  const WIN = "Win";
  const LOSE = "Lose";
  const IN_PROGRESS = "In progress";
  const targetWord = "tests";
  const ERROR_GAME_OVER = "The game is over; please reset the game.";
  const ERROR_ALREADY_GUESSED = "You have already guessed this word.";
  const ERROR_GUESS_WORD_LENGTH_INCORRECT = `Your guess must have ${targetWord.length} letters.`;
  const ALPHA_REGEX = /^[a-zA-Z]+$/;
  const targetLetters = targetWord.split("");
  const [currentGuess, setCurrentGuess] = useState("");
  const [guessHistory, setGuessHistory] = useState(Array.from({ length: MAX_ATTEMPTS }, () => []));
  const [attempts, setAttempts] = useState(0);
  const [gameStatus, setGameStatus] = useState(IN_PROGRESS);
  const [guessMessage, setGuessMessage] = useState("");
  function reset() {
    console.log("reset game");
    setGuessHistory(Array.from({ length: MAX_ATTEMPTS }, () => []));
    setCurrentGuess("");
    setAttempts(0);
    setGameStatus(IN_PROGRESS);
  }
  function handlePlay(nextGuess) {
    nextGuess = nextGuess.toLowerCase().trim();
    console.log("processing guess: " + nextGuess);
    if (gameStatus !== IN_PROGRESS) {
      console.log(ERROR_GAME_OVER);
      setGuessMessage(ERROR_GAME_OVER);
      return;
    }
    if (nextGuess.length != targetWord.length) {
      console.log(ERROR_GUESS_WORD_LENGTH_INCORRECT);
      setGuessMessage(ERROR_GUESS_WORD_LENGTH_INCORRECT);
      return;
    }
    if (guessHistory.some((g) => g.map((l) => l.letter).join("") === nextGuess)) {
      console.log(ERROR_ALREADY_GUESSED);
      setGuessMessage(ERROR_ALREADY_GUESSED);
      return;
    }
    setGuessMessage("");
    console.log("making a guess");
    const nextLetterGuess = Array(targetWord.length).fill(null).map((_, i) => ({
      letter: nextGuess[i],
      status: "absent"
    }));
    const matchedIndices = Array(targetWord.length).fill(false);
    for (let i = 0; i < targetWord.length; i++) {
      if (nextGuess[i] === targetLetters[i]) {
        nextLetterGuess[i].status = "correct";
        matchedIndices[i] = true;
      }
    }
    for (let i = 0; i < targetWord.length; i++) {
      if (nextLetterGuess[i].status === "correct") {
        continue;
      }
      const index = targetLetters.findIndex((c, idx) => c === nextGuess[i] && !matchedIndices[idx]);
      if (index !== -1) {
        nextLetterGuess[i].status = "present";
        matchedIndices[index] = true;
      }
    }
    const nextGuessHistory = [...guessHistory];
    nextGuessHistory[attempts] = nextLetterGuess;
    setGuessHistory(nextGuessHistory);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (nextGuess === targetWord) {
      console.log("win");
      setGameStatus(WIN);
    } else if (attempts >= MAX_ATTEMPTS) {
      console.log("lose");
      setGameStatus(LOSE);
    }
    console.log("attempts: " + attempts);
    setCurrentGuess("");
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { className: "status", children: [
      " Attempts remaining: ",
      MAX_ATTEMPTS - attempts,
      " "
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "status", children: [
      " Game status: ",
      gameStatus,
      " "
    ] }),
    /* @__PURE__ */ jsx("div", { className: "game", children: /* @__PURE__ */ jsx("div", { className: "game-board", children: /* @__PURE__ */ jsx(Board, { guessHistory }) }) }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(
        TextField,
        {
          className: "guess-textfield",
          label: "Guess",
          value: currentGuess,
          onChange: (e) => setCurrentGuess(e.target.value),
          onKeyDown: (e) => {
            if (!ALPHA_REGEX.test(e.key)) {
              e.preventDefault();
            }
          }
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "status", children: guessMessage })
    ] }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { type: "button", onClick: () => handlePlay(currentGuess), children: " Confirm " }) }),
    /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(Button, { type: "button", onClick: () => reset(), children: " Reset " }) })
  ] });
}
function Square({ letter, letterStatus }) {
  return /* @__PURE__ */ jsx("div", { className: `square ${letterStatus}`, children: letter });
}
function Board({ guessHistory }) {
  return /* @__PURE__ */ jsx("div", { className: "wordle-board", children: guessHistory.map((guessHistoryEntry, rowIndex) => /* @__PURE__ */ jsx("div", { className: "board-row", children: [0, 1, 2, 3, 4].map((i) => {
    var _a, _b;
    return /* @__PURE__ */ jsx(
      Square,
      {
        letter: ((_a = guessHistoryEntry == null ? void 0 : guessHistoryEntry[i]) == null ? void 0 : _a.letter) || "",
        letterStatus: ((_b = guessHistoryEntry == null ? void 0 : guessHistoryEntry[i]) == null ? void 0 : _b.status) || "absent"
      },
      i
    );
  }) }, rowIndex)) });
}
const wordle = withComponentProps(function Wordle() {
  return /* @__PURE__ */ jsx(WordleGame, {});
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: wordle
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CegG8TPS.js", "imports": ["/assets/chunk-HA7DTUK3-BaDD2dak.js", "/assets/index-Bi5LzHtx.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-f6VMox5o.js", "imports": ["/assets/chunk-HA7DTUK3-BaDD2dak.js", "/assets/index-Bi5LzHtx.js", "/assets/with-props-CwHmG_V2.js"], "css": ["/assets/root-CC9rEo_2.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/home-DyQ6k1JL.js", "imports": ["/assets/with-props-CwHmG_V2.js", "/assets/chunk-HA7DTUK3-BaDD2dak.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 }, "routes/wordle": { "id": "routes/wordle", "parentId": "root", "path": "wordle", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/wordle-cQvLLqNA.js", "imports": ["/assets/with-props-CwHmG_V2.js", "/assets/chunk-HA7DTUK3-BaDD2dak.js", "/assets/index-Bi5LzHtx.js"], "css": ["/assets/wordle-YmHFttsD.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-583c7fdb.js", "version": "583c7fdb" };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/wordle": {
    id: "routes/wordle",
    parentId: "root",
    path: "wordle",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
