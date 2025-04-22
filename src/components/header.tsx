// components/Header.tsx
export default function Header() {
  return (
    <header className="bg-blue-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="text-white text-xl font-bold">CostPredict</div>

          <nav className="hidden md:flex space-x-8">
            <a href="#predict" className="text-white font-medium">
              Predict
            </a>
            <a href="#icd" className="text-white font-medium">
              ICD
            </a>
            <a href="#medicine" className="text-white font-medium">
              Medicine
            </a>
          </nav>

          <button className="bg-white text-blue-600 px-4 py-2 rounded font-medium">
            User
          </button>
        </div>
      </div>
    </header>
  );
}
