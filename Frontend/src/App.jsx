// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Welcome from './Welcome Page/Welcome';
import SignIn from './SignIn';
import SignUp from './SignUp';
import AdminPage from './Admin Pages/Admin';
import EmployeePage from './Employee Pages/EmployeePage';
import ManagerPage from './Manager Pages/ManagerPage';
import Managerrequest from './Manager Pages/Managerrequest';
import ProtectedRoute from './ProtectedRoute';
import Forbidden from './Forbidden';
import CourseList from './Admin Pages/CourseList';
import Feedbacks from './Admin Pages/Feedback';
import ViewRequest from './Admin Pages/ViewRequest';
import CreateCourse from './Admin Pages/CreateCourse';
import EditCourse from './Admin Pages/EditCourse';
import EmployeeProgresses from './Admin Pages/EmployeeProgresses';
import CourseAssignment from './Admin Pages/CourseAssignment';
import DynamicForm from './Admin Pages/Createassesments';
import UpdateAssessment from './Admin Pages/updateAssessment';
import TakeAssessment from './Employee Pages/TakeAssessment';
import GiveFeedback from './Employee Pages/GiveFeedback';
import Thankyou from './Employee Pages/Thankyou';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/forbidden" element={<Forbidden />}/>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route element={<ProtectedRoute allowedRole="ROLE_ADMIN" />}>
          <Route path="/admin" element={<AdminPage />} />
          <Route path='/courselist' element={<CourseList/>}/>
          <Route path='/employeeprogress' element={<EmployeeProgresses/>}/>
          <Route path='/viewRequest' element={<ViewRequest/>}/>
          <Route path='/createCourse' element={<CreateCourse/>}/>
          <Route path='/editCourse' element={<EditCourse/>}/>
          <Route path='/courseassign' element={<CourseAssignment/>}/>
          <Route path='/feedbacks' element={<Feedbacks/>}/>
          <Route path='/createassessment' element={<DynamicForm/>}/>
          <Route path='/updateassessment' element={<UpdateAssessment/>}/>
        </Route>
        <Route element={<ProtectedRoute allowedRole="ROLE_MANAGER"/>}>
          <Route path="/manager" element={<ManagerPage />} />
          <Route path='/newrequest' element={<Managerrequest />} />
        </Route>
        <Route element={<ProtectedRoute allowedRole="ROLE_EMPLOYEE"/>}>
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/takeassessment" element={<TakeAssessment />} />
          <Route path="/givefeedback" element={<GiveFeedback />} />
          <Route path="/thankyou" element={<Thankyou />} />
        </Route>
        
      </Routes>
    </Router>
  );
}

export default App;
