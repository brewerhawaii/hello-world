package com.vinova.torus.features.session

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.vinova.torus.features.attract.AttractScreen
import com.vinova.torus.features.home.HomeScreen
import com.vinova.torus.features.assessment.AssessmentIntroScreen
import com.vinova.torus.features.recommendation.ResultsScreen

@Composable
fun TorusNavHost(navController: NavHostController, timeoutManager: SessionTimeoutManager) {
  NavHost(navController = navController, startDestination = "attract") {
    composable("attract") { AttractScreen(onStart = { navController.navigate("home") }) }
    composable("home") { HomeScreen(onAssessment = { navController.navigate("assessmentIntro") }) }
    composable("assessmentIntro") { AssessmentIntroScreen(onDone = { navController.navigate("results") }) }
    composable("results") { ResultsScreen(onReset = { navController.navigate("attract") }) }
  }
}
