console.log('hello world')
<<<<<<< Updated upstream
=======

function main() {
  //   const response = axiosClient('/posts')
  //   console.log(response)
  try {
    const querryParams = {
      _page: 1,
      _limit: 5,
    }

    const response = postApi.getAll(querryParams)
    console.log(postApi)
  } catch (error) {}
}

main()
>>>>>>> Stashed changes
