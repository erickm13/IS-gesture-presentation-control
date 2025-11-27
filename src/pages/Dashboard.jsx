import { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { IoCloudUploadOutline } from "react-icons/io5";
import { LuPresentation } from "react-icons/lu";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {
  const [pdfs, setPdfs] = useState([]);
const navigate = useNavigate();


  useEffect(() => {
    const loadPDFs = async () => {
      const uid = auth.currentUser.uid;
      const q = query(collection(db, "users", uid, "pdfs"));
      const snapshot = await getDocs(q);

      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setPdfs(list);
    };

    loadPDFs();
  }, []);

  const uploadPdf = ( () =>{
    console.log("hola")
  })

  const navigateToProyect = ( () => {
      navigate("/app/presenter");
  })

  return (
    <div>
      <h2>Mis Presentaciones</h2>
      <button onClick={uploadPdf}>
        <IoCloudUploadOutline /> Cargar presentación en PDF
      </button>

      <button onClick={navigateToProyect}>
        <LuPresentation /> Ver presentación de prueba
      </button>

      {pdfs.length === 0 && <p>No hay PDFs aún</p>}

      {pdfs.map(pdf => (
        <div 
          key={pdf.id}
          className="dash"
          onClick={() => window.location.href = `/app/presenter/${pdf.id}`}
        >
          <strong>{pdf.name}</strong>
          <p>Fecha: {pdf.createdAt}</p>
        </div>
      ))}
    </div>
  );
}
