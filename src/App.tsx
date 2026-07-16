import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import StudyHub from "./pages/StudyHub";
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/hub" element={<StudyHub />} />

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
  );
}

export default App;
