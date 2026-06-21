function calculateAge() {
    const dobInput = document.getElementById("dob").value;
    const result = document.getElementById("result");

    if (!dobInput) {
        result.innerHTML = " Please select your date of birth.";
        return;
    }

    const dob = new Date(dobInput);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();
    let days = today.getDate() - dob.getDate();

    if (days < 0) {
        months--;

        const previousMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        ).getDate();

        days += previousMonth;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    result.innerHTML = `
        🎉 You are <br><br>
        <span>${years}</span> Years,
        <span>${months}</span> Months,
        and <span>${days}</span> Days old.
    `;
}