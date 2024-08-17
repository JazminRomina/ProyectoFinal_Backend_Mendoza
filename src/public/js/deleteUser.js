document.querySelectorAll('.delete-user').forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const userId = form.getAttribute('data-id')
            try {
                const response = await fetch(`/api/users/deleteUser/${userId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                if (response.ok) {
                    location.reload()
                    console.log('User deleted successfully')
                } else {
                    console.log('Failed to delete user')
                }
            } catch (error) {
                console.error('Error:', error)
                console.log('There was an error deleting the user')
        }
    })
})