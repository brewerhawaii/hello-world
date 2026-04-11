package com.vinova.torus.features.assessment

import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

@Composable
fun AssessmentIntroScreen(onDone: () -> Unit) {
  Text("AssessmentIntroScreen")
  Button(onClick = { onDone() }) { Text("Continue") }
}
