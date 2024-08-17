document.querySelectorAll('.change-role-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const userId = form.getAttribute('data-id')
        try {
            const response = await fetch(`/api/users/premium/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                location.reload()
                console.log('Role changed successfully')
            } else {
                console.log('Failed to change role')
            }
        } catch (error) {
            console.log('There was an error changing the role')
        }
    })
})