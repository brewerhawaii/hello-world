package com.vinova.torus.features.attract

import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

@Composable
fun AttractScreen(onStart: () -> Unit) {
  Text("AttractScreen")
  Button(onClick = { onStart() }) { Text("Continue") }
}
