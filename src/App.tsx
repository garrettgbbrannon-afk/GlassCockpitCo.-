import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./lib/authContext";
import Landing from "./pages/Landing";
import StudyHub from "./pages/StudyHub";
import Progress from "./pages/Progress";
import Login from "./pages/Login";
import ExamSetup from "./pages/exam/ExamSetup";
import ExamRunner from "./pages/exam/ExamRunner";
import Debrief from "./pages/exam/Debrief";
import QuizSetup from "./pages/quiz/QuizSetup";
import QuizRunner from "./pages/quiz/QuizRunner";
import FlashcardSetup from "./pages/flashcards/FlashcardSetup";
import FlashcardRunner from "./pages/flashcards/FlashcardRunner";
import StruggleRunner from "./pages/struggle/StruggleRunner";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/hub" element={<StudyHub />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/login" element={<Login />} />

          <Route path="/exam" element={<ExamSetup />} />
          <Route path="/exam/run" element={<ExamRunner />} />
          <Route path="/exam/debrief" element={<Debrief />} />

          <Route path="/quiz" element={<QuizSetup />} />
          <Route path="/quiz/run" element={<QuizRunner />} />

          <Route path="/flashcards" element={<FlashcardSetup />} />
          <Route path="/flashcards/run" element={<FlashcardRunner />} />

          <Route path="/struggle" element={<StruggleRunner />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
