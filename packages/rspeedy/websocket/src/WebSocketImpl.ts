// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.

import { EventEmitter } from 'eventemitter3'

/**
 * An implementation of `Event` interface, that wraps a given event object.
 * @see https://dom.spec.whatwg.org/#event
 *
 * @public
 */
export interface Event<T extends string> {
  /**
   * The type os this event.
   * @see https://dom.spec.whatwg.org/#dom-event-type
   */
  type: T

  /** @internal */
  target: WebSocketImpl
}

interface WebSocketEvent {
  id: number
}

export interface WebSocketMessageEvent extends WebSocketEvent {
  type: 'text' /** | 'binary' | 'blob' */
  data: string /** | ArrayBuffer */
}

export interface WebSocketClosedEvent extends WebSocketEvent {
  code: number
  reason: string
  wasClean: boolean
}

export interface WebSocketOpenEvent extends WebSocketEvent {
  protocol: string
}

export interface WebSocketFailedEvent extends WebSocketEvent {
  message: string
}

/**
 * The `ReadyState` describe the state of a `WebSocket` connection.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/readyState
 * @public
 */
export enum ReadyState {
  /** Socket has been created. The connection is not yet open. */
  CONNECTING = 0,
  /** The connection is open and ready to communicate. */
  OPEN = 1,
  /** The connection is in the process of closing. */
  CLOSING = 2,
  /** The connection is closed or couldn't be opened. */
  CLOSED = 3,
}

export interface GlobalWebSocketEvent {
  websocketMessage: (event: WebSocketMessageEvent) => void
  websocketClosed: (event: WebSocketClosedEvent) => void
  websocketOpen: (event: WebSocketOpenEvent) => void
  websocketFailed: (event: WebSocketFailedEvent) => void
}

declare const lynx: {
  getJSModule(
    name: 'GlobalEventEmitter',
  ): EventEmitter<GlobalWebSocketEvent>

  reportError(error: Error, options?: { level?: 'warning' | 'error' }): void
}
export const GlobalEventEmitter: EventEmitter<GlobalWebSocketEvent> = lynx
  .getJSModule('GlobalEventEmitter')

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent/code
 */
export enum CloseCode {
  NORMAL = 1000,
  ABNORMAL = 1006,
}

export interface LynxWebSocketModule {
  connect(
    url: string,
    protocols: string[],
    options: { headers?: Record<string, string> },
    socketID: number,
  ): void
  send(message: string, socketID: number): void
  ping(socketID: number): void
  close(code: number, reason: string, socketID: number): void
}

/**
 * The `EventMap` describe the events that {@link @lynx-js/websocket#WebSocket} may fire.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type EventMap = {
  /**
   * The `message` event is fired when data is received through a {@link @lynx-js/websocket#WebSocket}.
   */
  message: Event<'message'> & { readonly data: string }
  /**
   * The `open` event is fired when a connection with a {@link @lynx-js/websocket#WebSocket} is opened.
   */
  open: Event<'open'>
  /**
   * The `close` event is fired when a connection with a {@link @lynx-js/websocket#WebSocket} is closed.
   */
  close: Event<'close'> & { readonly code: number, readonly reason: string }
  /**
   * The `error` event is fired when a connection with a {@link @lynx-js/websocket#WebSocket} has been closed due to an error (some data couldn't be sent for example).
   */
  error: Event<'error'> & { readonly message: string }
}

/**
 * @internal
 */
export class WebSocketImpl extends EventEmitter {
  readyState: ReadyState = ReadyState.CONNECTING

  protocol: string | undefined

  static #nextWebSocketId = 1
  #socketID: number = WebSocketImpl.#nextWebSocketId++

  constructor(
    private websocketModule: LynxWebSocketModule | undefined,
    public url: string,
    protocols?: string | string[],
    options: { headers?: Record<string, string> } = {},
  ) {
    super()

    if (!websocketModule) {
      lynx.reportError(
        new Error(
          `WebSocket is not found. Please use Lynx >= 2.16 or consider using a polyfill.`,
        ),
        { level: 'warning' },
      )
      return
    }

    if (typeof protocols === 'string') {
      protocols = [protocols]
    }

    if (!Array.isArray(protocols)) {
      protocols = []
    }

    this.#registerEvents()

    this.websocketModule?.connect(url, protocols, options, this.#socketID)
  }

  addEventListener<T extends keyof EventMap>(
    type: T,
    callback?: null | ((event: EventMap[T]) => void),
  ): void {
    if (!callback) {
      return
    }

    this.addListener(type, callback)
    return
  }

  removeEventListener<T extends keyof EventMap>(
    type: T,
    callback: (event: EventMap[T]) => void,
  ): this {
    return this.removeListener(type, callback)
  }

  dispatchEvent<T extends keyof EventMap>(event: Event<T>): boolean {
    return this.emit(event.type, event)
  }

  send(data: string | ArrayBuffer): void {
    if (this.readyState === ReadyState.CONNECTING) {
      throw new Error('INVALID_STATE_ERR')
    }

    if (
      this.readyState === ReadyState.CLOSING
      || this.readyState === ReadyState.CLOSED
    ) {
      return
    }

    if (typeof data === 'string') {
      this.websocketModule?.send(data, this.#socketID)
      return
    }

    // TODO: support binary data
    throw new Error('Unsupported data type')
  }

  ping(): void {
    if (this.readyState === ReadyState.CONNECTING) {
      throw new Error('INVALID_STATE_ERR')
    }

    if (
      this.readyState === ReadyState.CLOSING
      || this.readyState === ReadyState.CLOSED
    ) {
      return
    }

    this.websocketModule?.ping(this.#socketID)
  }

  close(code?: number, reason?: string): void {
    if (
      this.readyState === ReadyState.CLOSING
      || this.readyState === ReadyState.CLOSED
    ) {
      return
    }

    this.readyState = ReadyState.CLOSING
    this.#close(code, reason)
  }

  #close(code?: number, reason?: string) {
    // See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent
    const statusCode = typeof code === 'number' ? code : CloseCode.NORMAL
    const closeReason = typeof reason === 'string' ? reason : ''
    this.websocketModule?.close(statusCode, closeReason, this.#socketID)
  }

  #registerEvents(): void {
    /* eslint-disable @typescript-eslint/unbound-method */
    GlobalEventEmitter.addListener('websocketMessage', this.#onMessage, this)
    GlobalEventEmitter.addListener('websocketOpen', this.#onOpen, this)
    GlobalEventEmitter.addListener('websocketClosed', this.#onClosed, this)
    GlobalEventEmitter.addListener('websocketFailed', this.#onFailed, this)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  #unregisterEvents(): void {
    /* eslint-disable @typescript-eslint/unbound-method */
    GlobalEventEmitter.removeListener('websocketMessage', this.#onMessage)
    GlobalEventEmitter.removeListener('websocketOpen', this.#onOpen)
    GlobalEventEmitter.removeListener('websocketClosed', this.#onClosed)
    GlobalEventEmitter.removeListener('websocketFailed', this.#onFailed)
    /* eslint-enable @typescript-eslint/unbound-method */
  }

  #previousOnMessage: ((event: EventMap['message']) => void) | null = null
  get onmessage() {
    return this.#previousOnMessage
  }
  set onmessage(callback: ((event: EventMap['message']) => void) | null) {
    if (this.#previousOnMessage) {
      this.removeEventListener('message', this.#previousOnMessage)
    }
    this.addEventListener('message', callback)
    this.#previousOnMessage = callback
  }
  #onMessage(event: WebSocketMessageEvent): void {
    if (event.id !== this.#socketID) {
      return
    }

    const data = event.data

    switch (event.type) {
      case 'text':
        break
        // TODO: support binary data
    }

    this.dispatchEvent(this.#createWebSocketEvent('message', { data }))
  }

  #previousOnOpen: ((event: EventMap['open']) => void) | null = null
  get onopen() {
    return this.#previousOnOpen
  }
  set onopen(callback: ((event: EventMap['open']) => void) | null) {
    if (this.#previousOnOpen) {
      this.removeEventListener('open', this.#previousOnOpen)
    }
    this.addEventListener('open', callback)
    this.#previousOnOpen = callback
  }
  #onOpen(event: WebSocketOpenEvent): void {
    if (event.id !== this.#socketID) {
      return
    }

    this.readyState = ReadyState.OPEN
    this.protocol = event.protocol
    this.dispatchEvent(this.#createWebSocketEvent('open'))
  }

  #previousOnClose: ((event: EventMap['close']) => void) | null = null
  get onclose() {
    return this.#previousOnClose
  }
  set onclose(callback: ((event: EventMap['close']) => void) | null) {
    if (this.#previousOnClose) {
      this.removeEventListener('close', this.#previousOnClose)
    }
    this.addEventListener('close', callback)
    this.#previousOnClose = callback
  }
  #onClosed(event: WebSocketClosedEvent): void {
    if (event.id !== this.#socketID) {
      return
    }
    this.readyState = ReadyState.CLOSED
    this.dispatchEvent(
      this.#createWebSocketEvent('close', {
        code: event.code,
        reason: event.reason,
      }),
    )
    this.#unregisterEvents()
  }

  #previousOnError: ((event: EventMap['error']) => void) | null = null
  get onerror() {
    return this.#previousOnError
  }
  set onerror(callback: ((event: EventMap['error']) => void) | null) {
    if (this.#previousOnError) {
      this.removeEventListener('error', this.#previousOnError)
    }
    this.addEventListener('error', callback)
    this.#previousOnError = callback
  }
  #onFailed(event: WebSocketFailedEvent): void {
    if (event.id !== this.#socketID) {
      return
    }
    this.readyState = ReadyState.CLOSED
    this.dispatchEvent(
      this.#createWebSocketEvent('error', {
        message: event.message,
      }),
    )
    this.dispatchEvent(
      this.#createWebSocketEvent('close', {
        code: CloseCode.ABNORMAL,
        reason: event.message,
      }),
    )
    this.#unregisterEvents()
  }

  #createWebSocketEvent<T extends keyof EventMap>(
    type: T,
    data?: Omit<EventMap[T], 'type' | 'target'>,
  ): Event<T> {
    return Object.assign({ type, target: this }, data)
  }
}
