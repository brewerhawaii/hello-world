package com.vinova.torus.features.home

import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable

@Composable
fun HomeScreen(onAssessment: () -> Unit) {
  Text("HomeScreen")
  Button(onClick = { onAssessment() }) { Text("Continue") }
}
