import { Heart, Star, StarHalf } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ReviewProps {
  image: string;
  name: string;
  review: string;
  rating: number;
  likes: number;
}

export const Reviews = ({
  image,
  likes,
  name,
  rating,
  review,
}: ReviewProps) => {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating); // número de estrellas llenas
    const hasHalf = rating % 1 >= 0.5; // si hay media estrella

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 text-primary fill-current" />
      );
    }

    if (hasHalf) {
      stars.push(<StarHalf key="half" className="w-4 h-4 text-primary" />);
    }

    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-400" />);
    }

    return stars;
  };
  return (
    <div>
      <div className="flex items-start mt-5">
        <img
          src={image}
          alt="user"
          className="w-12 h-12 object-cover rounded-full mr-3 "
        />
        <div className="flex-1">
          <div className="flex space-x-2 items-center mb-2">
            <span> Review by</span>
            <span className="text-accent cursor-pointer">{name}</span>
            {renderStars(rating)}
            <span className="text-primary">({rating}/5) </span>
          </div>
          <p className=" mb-2">{review}</p>
          <div className=" text-gray-400 flex items-center">
            <Heart className="h-4 w-4 hover:text-red-600 cursor-pointer" />
            <span className=" ml-1">{likes} likes</span>
          </div>
        </div>
      </div>
      <Separator className="mt-5" />
    </div>
  );
};
