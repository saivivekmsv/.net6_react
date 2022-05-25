using Microsoft.AspNetCore.Mvc;

namespace test2.Controllers
{
    public class ProviderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
