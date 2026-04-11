package com.vinova.torus.features.recommendation

import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

@Composable
fun ResultsScreen(onReset: () -> Unit) {
  Text("ResultsScreen")
  Button(onClick = { onReset() }) { Text("Continue") }
}
