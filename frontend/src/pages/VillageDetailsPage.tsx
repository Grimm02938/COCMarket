import { VillageDetails } from "@/components/VillageDetails";
import { useNavigate, useParams } from "react-router-dom";

const VillageDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const handleBack = () => {
    navigate('/');
  };

  return (
    <VillageDetails 
      villageId={id ? parseInt(id) : 1} 
      onBack={handleBack}
    />
  );
};

export default VillageDetailsPage;