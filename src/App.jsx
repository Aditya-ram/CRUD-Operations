import { useEffect, useState, useRef } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    username: '',
    age: '',
    gender: '',
  });
  const [profile, setProfile] = useState([]);
  const [isEdit, setIsEdit] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [filteredData,setFilteredData] = useState([]);
  const [sort,setSort] = useState({key:"",direction:""});
  const pointer = useRef(false);

  // console.log("current pointer is ",pointer.current)
  function handleInput(event) {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  }


  function handleSubmit(event) {
    event.preventDefault();
    // setFilteredData(profile);
    if (formData.username === '' || formData.age === '' || formData.gender === '') {
      alert('Please Enter all fields');
      return;
    }

    if (isEdit !== null) {
  
      const updatedProfile = profile.map((ele) =>{
        if(ele.id === selectedId){
          return{ ...ele, username: formData.username, age: formData.age, gender: formData.gender }
        }
        else{
          return ele
        }
    });
      setProfile(updatedProfile);
      setIsEdit(null); 
      setSelectedId(null);
    } else {
  
      const newProfile = { ...formData, id: new Date().getTime().toString() };
      setProfile([...profile, newProfile]);
    }

    setFormData({ username: '', age: '', gender: '' });
    
  }

  // Load profiles from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('profile');
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  useEffect(()=>{
    setFilteredData(profile)
  },[profile])
  // Save profiles to localStorage
  useEffect(() => {
    if (pointer.current) {
      localStorage.setItem('profile', JSON.stringify(profile));
    } else {
      pointer.current = true;
    }
  }, [profile]);


  
  function handleDelete(id) {
    setProfile(profile.filter((item) => item.id !== id));
  }


  function handleEdit(id) {
    const editP = profile.find((ele) => ele.id === id);
    setFormData({ username: editP.username, age: editP.age, gender: editP.gender });
    setSelectedId(editP.id);
    setIsEdit(id);
  }

  function searchUser(event){
    setFilteredData(profile.filter((item)=>{
      return(
        item.username.toLowerCase().startsWith(event.target.value.toLowerCase())||item.age.toLowerCase().startsWith(event.target.value.toLowerCase())||item.gender.toLowerCase().startsWith(event.target.value.toLowerCase())
    )}))
  }
//  function handleSort(key){
//       const direction=sort.key=== key && sort.direction==="asc" ?"dsc":"asc"
//     const arraysss = [...profile].sort((a,b)=>{
//       if(a[key]<b[key]) return direction==='asc'?-1:1;
//       if(a[key]>b[key]) return direction==='dsc'?1:-1;
//        return 0;
//     })
//     setProfile(arraysss);
//     setSort({
//       key,
//       direction
//     })

//   }
  return (
    <>
      <form action="">
        <label>
          <input type="text" placeholder= "search"onChange={searchUser} />
        </label>
        <br />
        <label>
          Username:
          <input type="text" name="username" value={formData.username} onChange={handleInput} />
        </label>
        <br />
        <label>
          Age:
          <input type="text" name="age" value={formData.age} onChange={handleInput} />
        </label>
        <br />
        <label>
          Gender:
          <input type="text" name="gender" value={formData.gender} onChange={handleInput} />
          
        </label>
        <br />
        <button onClick={handleSubmit} type="submit">
          {isEdit ? 'Update Details' : 'Add Details'}
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>Name
                 {/* <button onClick={()=>handleSort("username")}>{sort.key==="username" && sort.direction==='asc'?"🡡":"🡣"}</button> */}
            </th>
            <th>
              Age 
              {/* <button onClick={()=>handleSort("age")}>{sort.key==="age" && sort.direction==='asc'?"🡡":"🡣"}</button> */}
            </th>
                 
            <th>
              Gender 
              {/* <button onClick={()=>handleSort("gender")}>{sort.key==='gender' && sort==='asc'?"🡡":"🡣"}</button> */}
            </th>
                 
            <th colSpan={2}>Delete/Edit</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map(({ username, age, gender, id }) => {
            return (
              <tr key={id}>
                <td>{username}</td>
                <td>{age}</td>
                <td>{gender}</td>
                <td>
                  <button onClick={() => handleDelete(id)}>Delete</button>
                </td>
                <td>
                  <button onClick={() => handleEdit(id)}>Edit</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}

export default App;
