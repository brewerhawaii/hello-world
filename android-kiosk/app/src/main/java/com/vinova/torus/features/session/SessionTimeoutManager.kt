package com.vinova.torus.features.session

import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class SessionTimeoutManager(
  private val timeoutMs: Long = 90_000L,
) {
  private val scope = CoroutineScope(Dispatchers.Default)
  private var timer: Job? = null

  fun onUserInteraction(onTimeout: () -> Unit) {
    timer?.cancel()
    timer = scope.launch {
      delay(timeoutMs)
      onTimeout()
    }
  }

  fun clear() = timer?.cancel()
}
