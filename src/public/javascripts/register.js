function selectRole(role) {
    console.log('Selected role:', role); // Thêm dòng này để kiểm tra giá trị role
    document.getElementById('role').value = role;
    const isInstructor = role === 'Instructor';
    document.getElementById('instructor-fields').classList.toggle('hidden', !isInstructor);
    document.getElementById('student-role').classList.toggle('active', !isInstructor);
    document.getElementById('instructor-role').classList.toggle('active', isInstructor);
}

document.addEventListener('DOMContentLoaded', function () {
    const currentRole = document.getElementById('role').value;
    selectRole(currentRole);
});
