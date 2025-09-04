import { Separator } from "@/components/ui/separator";
import { Reviews } from "./Review";

export const PopularReviews = () => {
  return (
    <div className="space-x-1 pt-10 lg:pt-18 ">
      <div className="flex justify-between mb-1">
        <span>Popular Reviews</span>
        <span className="hover:text-blue-500 cursor-pointer">MORE</span>
      </div>
      <Separator className="mt-1 mb-5" />
      <Reviews
        image="https://s.yimg.com/ny/api/res/1.2/apvEPmxMybSaho8_zOMPjw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD04Mjg7Y2Y9d2VicA--/https://media.zenfs.com/es/es.afp.com/e93ab154e393bec7e1dc3d0420b14e62"
        likes={12}
        name="Leandro"
        rating={4.5}
        review="Leandro Paredes's FUT Birthday card is rated 90, he is a 180cm | 5'11 tall, right-footed Argentina midfielder (CM) that plays for AS Roma in Serie A TIM. He has 5-star weak foot and 5-star skill moves, giving him the ability to perform every skill move in the game."
      />
      <Reviews
        image="https://resizer.glanacion.com/resizer/v2/rodrigo-de-paul-llego-al-pais-y-mostro-su-osado-GUBEIUNUPJBFZO7YXKQN7MZPSE.png?auth=55a5f5a3d5418236e76009ec7332a46349b526c42024a0883fdedef0108408f3&width=1280&height=854&quality=70&smart=true"
        likes={7}
        name="Rodrigo"
        rating={3}
        review="Rodrigo De Paul's Team of the Season card is rated 93, he is a 180cm | 5'11 tall, right-footed Argentina midfielder (CM) that plays for Atlético de Madrid in LALIGA EA SPORTS. He has 4-star weak foot and 5-star skill moves, giving him the ability to perform every skill move in the game."
      />
    </div>
  );
};
