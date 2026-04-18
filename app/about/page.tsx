
async function makePostRequest() {
  const res = await fetch(`${process.env.NEXT_URL}/api/hello`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name: "Mahin"}),
  });

  const data = await res.json();
  return {data};
  
}

export default async function About() {

  const {data} = await makePostRequest();

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
   <h1>About Page <br /> {data.message}</h1>
      </main>
    </div>
  );
}
